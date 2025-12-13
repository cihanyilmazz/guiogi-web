// pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Alert,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserAddOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Item } = Form;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (values: { 
    name: string; 
    email: string; 
    password: string; 
    confirmPassword: string;
    phone?: string;
  }) => {
    try {
      if (values.password !== values.confirmPassword) {
        throw new Error('Şifreler eşleşmiyor');
      }

      setLoading(true);
      setError(null);
      
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone
      });
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
      <Content className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl">
          <div className="text-center mb-8">
            <Title level={2} className="text-gray-800">
              Guiaogi Turizm'e Kayıt Ol
            </Title>
            <Text className="text-gray-500">
              Ücretsiz hesap oluşturun, fiyatları görün ve rezervasyon yapın
            </Text>
          </div>

          {error && (
            <Alert
              message="Hata"
              description={error}
              type="error"
              showIcon
              className="mb-6"
              closable
              onClose={() => setError(null)}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleRegister}
            size="large"
          >
            <Item
              name="name"
              label="Ad Soyad"
              rules={[
                { required: true, message: 'Lütfen adınızı ve soyadınızı girin' },
                { min: 2, message: 'En az 2 karakter girin' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Adınız Soyadınız"
              />
            </Item>
            
            <Item
              name="email"
              label="E-posta Adresi"
              rules={[
                { required: true, message: 'Lütfen e-posta adresinizi girin' },
                { type: 'email', message: 'Geçerli bir e-posta adresi girin' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="ornek@email.com"
              />
            </Item>
            
            <Item
              name="phone"
              label="Telefon Numarası (İsteğe Bağlı)"
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="05XX XXX XX XX"
              />
            </Item>
            
            <Item
              name="password"
              label="Şifre"
              rules={[
                { required: true, message: 'Lütfen şifrenizi girin' },
                { min: 6, message: 'Şifre en az 6 karakter olmalı' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Şifreniz"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Item>
            
            <Item
              name="confirmPassword"
              label="Şifre Tekrar"
              rules={[
                { required: true, message: 'Lütfen şifrenizi tekrar girin' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Şifreler eşleşmiyor'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Şifrenizi tekrar girin"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Item>
            
            <Item className="mb-0">
              <Text className="text-xs text-gray-500">
                Hesap oluşturarak,{' '}
                <Link to="/kullanim-kosullari" className="text-blue-600">
                  Kullanım Koşulları
                </Link>{' '}
                ve{' '}
                <Link to="/gizlilik-politikasi" className="text-blue-600">
                  Gizlilik Politikası
                </Link>{' '}
                'nı kabul etmiş olursunuz.
              </Text>
            </Item>
            
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<UserAddOutlined />}
                className="h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
              >
                Kayıt Ol
              </Button>
            </Item>
          </Form>

          <Divider className="my-6">
            <Text className="text-gray-400">veya</Text>
          </Divider>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <Text className="text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link to="/giris" className="text-blue-600 hover:text-blue-700 font-semibold">
                Giriş Yapın
              </Link>
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default Register;