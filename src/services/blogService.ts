// services/blogService.ts

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  views?: number;
  readingTime?: number;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

class BlogService {
  async getAllBlogs(): Promise<BlogPost[]> {
    try {
      const response = await fetch('http://49.13.94.27/:3005/blogs');
      if (response.ok) {
        const data = await response.json();
        const blogs = Array.isArray(data) ? data : [];
        // Yayınlanmış blogları ve tarihe göre sırala
        return blogs
          .filter((blog: BlogPost) => blog.isPublished)
          .sort((a: BlogPost, b: BlogPost) => 
            new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
      }
    } catch (error) {
      console.error('Bloglar yüklenirken hata:', error);
    }
    return [];
  }

  async getAllBlogsForAdmin(): Promise<BlogPost[]> {
    try {
      const response = await fetch('http://49.13.94.27/:3005/blogs');
      if (response.ok) {
        const data = await response.json();
        const blogs = Array.isArray(data) ? data : [];
        // Tüm blogları tarihe göre sırala
        return blogs.sort((a: BlogPost, b: BlogPost) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
      }
    } catch (error) {
      console.error('Bloglar yüklenirken hata:', error);
    }
    return [];
  }

  async getBlogById(id: string | number): Promise<BlogPost | null> {
    try {
      const response = await fetch(`http://49.13.94.27/:3005/blogs/${id}`);
      if (response.ok) {
        const blog = await response.json();
        return blog;
      }
    } catch (error) {
      console.error('Blog detayı yüklenirken hata:', error);
    }
    return null;
  }

  async getBlogBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const blogs = await this.getAllBlogs();
      const blog = blogs.find(b => b.slug === slug);
      return blog || null;
    } catch (error) {
      console.error('Blog slug ile yüklenirken hata:', error);
    }
    return null;
  }

  async getBlogsByCategory(category: string): Promise<BlogPost[]> {
    try {
      const blogs = await this.getAllBlogs();
      return blogs.filter(blog => blog.category === category);
    } catch (error) {
      console.error('Kategoriye göre bloglar yüklenirken hata:', error);
    }
    return [];
  }

  async getBlogsByTag(tag: string): Promise<BlogPost[]> {
    try {
      const blogs = await this.getAllBlogs();
      return blogs.filter(blog => blog.tags.includes(tag));
    } catch (error) {
      console.error('Taga göre bloglar yüklenirken hata:', error);
    }
    return [];
  }

  async searchBlogs(query: string): Promise<BlogPost[]> {
    try {
      const blogs = await this.getAllBlogs();
      const searchQuery = query.toLowerCase();
      return blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery) ||
        blog.excerpt.toLowerCase().includes(searchQuery) ||
        blog.content.toLowerCase().includes(searchQuery) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );
    } catch (error) {
      console.error('Blog araması yapılırken hata:', error);
    }
    return [];
  }

  async getAllCategories(): Promise<string[]> {
    try {
      const blogs = await this.getAllBlogs();
      const categories = Array.from(new Set(blogs.map(blog => blog.category)))
        .filter(cat => cat && cat.trim() !== '')
        .sort();
      return categories;
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
    return [];
  }

  async getAllTags(): Promise<string[]> {
    try {
      const blogs = await this.getAllBlogs();
      const allTags = blogs.flatMap(blog => blog.tags || []);
      const uniqueTags = Array.from(new Set(allTags))
        .filter(tag => tag && tag.trim() !== '')
        .sort();
      return uniqueTags;
    } catch (error) {
      console.error('Taglar yüklenirken hata:', error);
    }
    return [];
  }

  async createBlog(blogData: Omit<BlogPost, 'id' | 'publishedAt' | 'updatedAt'>): Promise<BlogPost> {
    try {
      const slug = this.generateSlug(blogData.title);
      const newBlog: BlogPost = {
        ...blogData,
        id: Date.now().toString(),
        slug,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        readingTime: this.calculateReadingTime(blogData.content),
      };

      const response = await fetch('http://49.13.94.27/:3005/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlog),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Blog oluşturulamadı');
      }
    } catch (error) {
      console.error('Blog oluşturulurken hata:', error);
      throw error;
    }
  }

  async updateBlog(id: string | number, blogData: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const existingBlog = await this.getBlogById(id);
      if (!existingBlog) {
        throw new Error('Blog bulunamadı');
      }

      const updatedBlog: BlogPost = {
        ...existingBlog,
        ...blogData,
        id,
        updatedAt: new Date().toISOString(),
        readingTime: blogData.content 
          ? this.calculateReadingTime(blogData.content)
          : existingBlog.readingTime,
      };

      // Slug'ı güncelle eğer başlık değiştiyse
      if (blogData.title && blogData.title !== existingBlog.title) {
        updatedBlog.slug = this.generateSlug(blogData.title);
      }

      const response = await fetch(`http://49.13.94.27/:3005/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBlog),
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Blog güncellenemedi');
      }
    } catch (error) {
      console.error('Blog güncellenirken hata:', error);
      throw error;
    }
  }

  async deleteBlog(id: string | number): Promise<void> {
    try {
      const response = await fetch(`http://49.13.94.27/:3005/blogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Blog silinemedi');
      }
    } catch (error) {
      console.error('Blog silinirken hata:', error);
      throw error;
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

export const blogService = new BlogService();



