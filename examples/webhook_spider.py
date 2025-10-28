import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
import json
import requests
from scrapy import signals
from scrapy.exceptions import NotConfigured


class ProductItem(scrapy.Item):
    title = scrapy.Field()
    price = scrapy.Field()
    rating = scrapy.Field()


class WebhookPipeline:
    """Pipeline to POST scraped items to a webhook endpoint"""
    
    def __init__(self, webhook_url):
        self.webhook_url = webhook_url
        self.items_sent = 0
    
    @classmethod
    def from_crawler(cls, crawler):
        webhook_url = crawler.settings.get('WEBHOOK_URL')
        if not webhook_url:
            raise NotConfigured('WEBHOOK_URL setting is required')
        
        pipeline = cls(webhook_url)
        crawler.signals.connect(pipeline.spider_closed, signal=signals.spider_closed)
        return pipeline
    
    def process_item(self, item, spider):
        try:
            # Convert item to dict for JSON serialization
            item_dict = dict(item)
            
            # POST to webhook
            response = requests.post(
                self.webhook_url,
                json=item_dict,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            response.raise_for_status()
            
            self.items_sent += 1
            spider.logger.info(f'Successfully sent item to webhook: {self.webhook_url}')
            
        except Exception as e:
            spider.logger.error(f'Failed to send item to webhook: {e}')
        
        return item
    
    def spider_closed(self, spider):
        spider.logger.info(f'Total items sent to webhook: {self.items_sent}')


class ProductsSpider(CrawlSpider):
    name = 'products_spider'
    allowed_domains = []
    start_urls = [
        'https://example.com/products',
    ]

    custom_settings = {
        'ITEM_PIPELINES': {
            '__main__.WebhookPipeline': 300,
        },
        'WEBHOOK_URL': 'https://webhook.site/unique-id',
    }

    rules = (
        Rule(LinkExtractor(restrict_css='a.next-page'), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        item = ProductItem()
        item['title'] = response.css('h1.product-title::text').get()
        item['price'] = response.css('span.price::text').get()
        item['rating'] = response.css('div.rating::attr(data-rating)').get()
        return item


# Usage instructions:
# Run the spider with webhook output:
# scrapy runspider webhook_spider.py
# 
# Note: Items will be automatically POSTed to: https://webhook.site/unique-id
# Each item is sent as a JSON object via HTTP POST request.
# You can also save to file simultaneously:
# scrapy runspider webhook_spider.py -o output.json
