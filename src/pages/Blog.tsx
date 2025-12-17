// pages/Blog.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Select, Spin, Tag, Row, Col, Empty } from 'antd';
import { SearchOutlined, CalendarOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { blogService, BlogPost } from '../services/blogService';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Option } = Select;

const BlogPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = "Blog | GuiaOgi";
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, selectedCategory, searchQuery]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const allBlogs = await blogService.getAllBlogs();
      const allCategories = await blogService.getAllCategories();
      
      setBlogs(allBlogs);
      setCategories(allCategories);
    } catch (error) {
      console.error('Bloglar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = [...blogs];

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(query) ||
        blog.excerpt.toLowerCase().includes(query) ||
        blog.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredBlogs(filtered);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBlogClick = (blog: BlogPost) => {
    navigate(`/blog/${blog.slug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t("blog.blogDesc")}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Search
                placeholder={t('blog.searchPlaceholder')}
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                value={searchQuery}
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder={t("blog.selectCategory")}
                size="large"
                style={{ width: '100%' }}
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <Option value="all">{t('blog.allCategories')}</Option>
                {categories.map(category => (
                  <Option key={category} value={category}>{category}</Option>
                ))}
              </Select>
            </Col>
          </Row>
        </div>

        {/* Blog List */}
        {filteredBlogs.length === 0 ? (
          <Empty description={t('blog.noPostsFound')} />
        ) : (
          <Row gutter={[24, 24]}>
            {filteredBlogs.map((blog) => (
              <Col xs={24} md={12} lg={8} key={blog.id}>
                <Card
                  hoverable
                  className="h-full shadow-md hover:shadow-lg transition-shadow"
                  cover={
                    <div className="relative h-48 overflow-hidden">
                      <img
                        alt={blog.title}
                        src={blog.featuredImage}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('placeholder')) {
                            target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                          }
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Tag color="blue">{blog.category}</Tag>
                      </div>
                    </div>
                  }
                  onClick={() => handleBlogClick(blog)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {blog.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <Tag key={index} color="default">{tag}</Tag>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CalendarOutlined />
                        {formatDate(blog.publishedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {blog.readingTime && (
                        <span className="flex items-center gap-1">
                          <ClockCircleOutlined />
                          {blog.readingTime} {t("blog.minutes")}
                        </span>
                      )}
                      {blog.views && (
                        <span className="flex items-center gap-1">
                          <EyeOutlined />
                          {blog.views}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default BlogPage;

