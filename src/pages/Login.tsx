// pages/Login.tsx
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
  LockOutlined, 
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Item } = Form;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      await login(values.email, values.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || t('auth.checkInfo'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Demo kullanıcı
    form.setFieldsValue({ 
      email: 'demo@guiaogi.com', 
      password: 'demo123' 
    });
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Content className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl">
          <div className="text-center mb-8">
            <Title level={2} className="text-gray-800">
              {t('auth.loginTitle')}
            </Title>
            <Text className="text-gray-500">
              {t('auth.loginSubtitle')}
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
            onFinish={handleLogin}
            size="large"
          >
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
            
            <div className="flex justify-between items-center mb-6">
              <Link to="/sifremi-unuttum" className="text-blue-600 hover:text-blue-700 text-sm">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<LoginOutlined />}
                className="h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
              >
                {t('auth.loginButton')}
              </Button>
            </Item>
          </Form>

          <Divider className="my-6">
            <Text className="text-gray-400">{t("auth.or")}</Text>
          </Divider>

          <div className="text-center">
            <Button
              type="dashed"
              block
              size="large"
              onClick={handleDemoLogin}
              className="mb-4"
            >
              {t('auth.demoLogin')}
            </Button>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <Text className="text-gray-600">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/kayit" className="text-blue-600 hover:text-blue-700 font-semibold">
                {t('auth.registerNow')}
              </Link>
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;