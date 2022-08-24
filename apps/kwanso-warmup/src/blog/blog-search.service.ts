import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Blog } from './entities/blog.entity';

@Injectable()
export default class BlogSearchService {
  indexName = 'blogs';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  /**
   * Indexes a blog in elasticsearch index
   * @param blog Blog
   * @returns Promise<boolean>
   */
  async index(blog: Blog): Promise<boolean> {
    const result = await this.elasticsearchService.index<Blog>({
      id: blog.id,
      index: this.indexName,
      document: blog,
    });
    return result.result == 'created';
  }

  /**
   * Upserts a blog in elasticsearch index
   * @param blog Blog
   * @returns Promise<boolean>
   */
  async update(blog: Blog): Promise<boolean> {
    const result = await this.elasticsearchService.update({
      index: this.indexName,
      id: blog.id,
      doc: blog,
      doc_as_upsert: true,
    });
    return result.result == 'updated';
  }

  /**
   * Removes a blog from elasticsearch index by id
   * @param id string
   * @returns Promise<boolean>
   */
  async remove(id: string): Promise<boolean> {
    const result = await this.elasticsearchService.delete({
      index: this.indexName,
      id,
    });
    return result.result == 'deleted';
  }

  /**
   * Search blogs from elasticsearch
   * @param text
   * @returns Promise<Blog[]>
   */
  async search(text: string): Promise<Blog[]> {
    const searchResult = await this.elasticsearchService.search<Blog>({
      index: this.indexName,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'description', 'shortDescription', 'content'],
          },
        },
      },
    });
    const hits = searchResult.hits.hits;
    return hits.map((item) => item._source);
  }

  /**
   * Sync all blogs in elasticsearch index
   * CAUTION: This is helper function, must not be used in production
   * @param blogs string
   * @returns Promise<boolean>
   */
  async sync(blogs: Blog[]): Promise<boolean> {
    blogs.map((blog) => {
      this.index(blog);
    });
    return true;
  }
}
