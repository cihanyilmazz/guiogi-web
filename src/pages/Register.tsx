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
import { useTranslation } from 'react-i18next';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Item } = Form;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();
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
        throw new Error(t('auth.passwordsNotMatch'));
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
      setError(err.message || t('auth.registerError'));
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
              {t('auth.registerTitle')}
            </Title>
            <Text className="text-gray-500">
              {t('auth.registerSubtitle')}
            </Text>
          </div>

          {error && (
            <Alert
              message={t('home.error')}
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
              label={t('auth.name')}
              rules={[
                { required: true, message: t('auth.nameRequired') },
                { min: 2, message: t('auth.nameMinLength') }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder={t('auth.namePlaceholder')}
              />
            </Item>
            
            <Item
              name="email"
              label={t('auth.emailLabel')}
              rules={[
                { required: true, message: t('auth.emailRequired') },
                { type: 'email', message: t('auth.emailInvalid') }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder={t("auth.emailPlaceholder")}
              />
            </Item>
            
            <Item
              name="phone"
              label={t('auth.phoneOptional')}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder={t("auth.phonePlaceholder")}
              />
            </Item>
            
            <Item
              name="password"
              label={t('auth.passwordLabel')}
              rules={[
                { required: true, message: t('auth.passwordRequired') },
                { min: 6, message: t('auth.passwordMinLength') }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder={t('auth.passwordPlaceholder')}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Item>
            
            <Item
              name="confirmPassword"
              label={t('auth.confirmPassword')}
              rules={[
                { required: true, message: t('auth.confirmPasswordRequired') },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t('auth.passwordsNotMatch')));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Item>
            
            <Item className="mb-0">
              <Text className="text-xs text-gray-500">
                {t("auth.termsAccept")}{' '}
                <Link to="/kullanim-kosullari" className="text-blue-600">
                  {t("auth.termsOfUse")}
                </Link>{' '}
                {t("auth.and")}{' '}
                <Link to="/gizlilik-politikasi" className="text-blue-600">
                  {t("auth.privacyPolicy")}
                </Link>{' '}
                {t("auth.acceptTerms")}
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
                {t('auth.registerButton')}
              </Button>
            </Item>
          </Form>

          <Divider className="my-6">
            <Text className="text-gray-400">{t('auth.or')}</Text>
          </Divider>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <Text className="text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/giris" className="text-blue-600 hover:text-blue-700 font-semibold">
                {t('auth.loginNow')}
              </Link>
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default Register;