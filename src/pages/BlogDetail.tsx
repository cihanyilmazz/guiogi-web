// pages/BlogDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Tag, Button, Row, Col, Spin, Divider } from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FacebookOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { blogService, BlogPost } from '../services/blogService';
import { useTranslation } from 'react-i18next';

const BlogDetail: React.FC = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogData();
  }, [slug]);

  const fetchBlogData = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const blogData = await blogService.getBlogBySlug(slug);
      
      if (!blogData) {
        navigate('/blog');
        return;
      }

      setBlog(blogData);

      // Son yazıları getir (en yeni 3 yazı, mevcut yazı hariç)
      const allBlogs = await blogService.getAllBlogs();
      const recent = allBlogs
        .filter(b => b.id !== blogData.id)
        .slice(0, 3);
      setRelatedBlogs(recent);

      // Görüntülenme sayısını artır (isteğe bağlı)
      // await blogService.incrementViews(blogData.id);
    } catch (error) {
      console.error('Blog detayı yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform: string) => {
    if (!blog) return;

    const url = window.location.href;
    const text = blog.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
    }
  };

  const handleRelatedBlogClick = (blogSlug: string) => {
    navigate(`/blog/${blogSlug}`);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('blogDetail.postNotFound')}</h2>
          <Button type="primary" onClick={() => navigate('/blog')}>
            {t('blogDetail.backToBlog')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/blog')}
          className="mb-6"
        >
          {t('blogDetail.backToBlog')}
        </Button>

        <Row gutter={[24, 24]}>
          {/* Main Content */}
          <Col xs={24} lg={16}>
            <Card className="shadow-lg">
              {/* Featured Image */}
              <div className="mb-6">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('placeholder')) {
                      target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                    }
                  }}
                />
              </div>

              {/* Category and Tags */}
              <div className="mb-4">
                <Tag color="blue" className="mb-2">{blog.category}</Tag>
                {blog.tags.map((tag, index) => (
                  <Tag key={index} className="mb-2">{tag}</Tag>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <CalendarOutlined />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                {blog.readingTime && (
                  <div className="flex items-center gap-2">
                    <ClockCircleOutlined />
                    <span>{blog.readingTime} {t('blogDetail.readingTime')}</span>
                  </div>
                )}
                {blog.views && (
                  <div className="flex items-center gap-2">
                    <EyeOutlined />
                    <span>{blog.views} {t('blogDetail.views')}</span>
                  </div>
                )}
              </div>

              <Divider />

              {/* Content */}
              <div
                className="prose max-w-none blog-content"
                dangerouslySetInnerHTML={{ __html: blog.content }}
                style={{
                  fontSize: '18px',
                  lineHeight: '1.8',
                  color: '#374151'
                }}
              />

              <Divider />

              {/* Share Buttons */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">{t('blogDetail.share')}</h3>
                <div className="flex gap-3">
                  <Button
                    icon={<FacebookOutlined />}
                    onClick={() => handleShare('facebook')}
                  >
                    Facebook
                  </Button>
                  <Button
                    icon={<TwitterOutlined />}
                    onClick={() => handleShare('twitter')}
                  >
                    Twitter
                  </Button>
                  <Button
                    icon={<WhatsAppOutlined />}
                    onClick={() => handleShare('whatsapp')}
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white' }}
                  >
                    WhatsApp
                  </Button>
                </div>
              </div>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col xs={24} lg={8}>
            {/* Recent Blogs */}
            {relatedBlogs.length > 0 && (
              <Card className="shadow-md" title={t('blogDetail.recentPosts')}>
                <div className="space-y-4">
                  {relatedBlogs.map((relatedBlog) => (
                    <div
                      key={relatedBlog.id}
                      className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                      onClick={() => handleRelatedBlogClick(relatedBlog.slug)}
                    >
                      <img
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.title}
                        className="w-full h-32 object-cover rounded mb-2"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.src.includes('placeholder')) {
                            target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                          }
                        }}
                      />
                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(relatedBlog.publishedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </div>

      <style>{`
        .blog-content h2 {
          font-size: 1.75rem;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        .blog-content h3 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #111827;
        }
        .blog-content p {
          margin-bottom: 1.5rem;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;

