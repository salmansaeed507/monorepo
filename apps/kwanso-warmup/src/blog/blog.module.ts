import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { CommentModule } from 'src/comment/comment.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import BlogSearchService from './blog-search.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog]),
    CommentModule,
    UserModule,
    FileUploadModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [BlogResolver, BlogService, BlogSearchService],
  exports: [BlogService],
})
export class BlogModule {}
