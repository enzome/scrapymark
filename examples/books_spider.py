import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule


class BookItem(scrapy.Item):
    title = scrapy.Field()
    price = scrapy.Field()
    rating = scrapy.Field()
    description = scrapy.Field()


class BooksSpider(CrawlSpider):
    name = 'books_spider'
    allowed_domains = []
    start_urls = [
        'https://books.toscrape.com/',
    ]

    rules = (
        Rule(LinkExtractor(restrict_css='a.next'), callback='parse_item', follow=True),
    )

    def parse_item(self, response):
        item = BookItem()
        item['title'] = response.css('h1::text').get()
        item['price'] = response.css('.price_color::text').get()
        item['rating'] = response.css('.star-rating::attr(class)').get()
        item['description'] = response.css('#product_description + p::text').get()
        return item
