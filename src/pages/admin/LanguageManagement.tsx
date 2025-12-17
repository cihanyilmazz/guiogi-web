// pages/admin/LanguageManagement.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Card, 
  Tabs,
  Tag,
  Popconfirm,
  Divider,
  InputNumber
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  GlobalOutlined,
  SaveOutlined,
  ReloadOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { addLanguage } from '../../i18n/config';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { TabPane } = Tabs;

interface Language {
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
}

// Önceden tanımlı diller listesi
const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', isActive: true },
  { code: 'en', name: 'English', nativeName: 'English', isActive: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', isActive: true },
  { code: 'fr', name: 'French', nativeName: 'Français', isActive: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', isActive: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', isActive: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', isActive: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', isActive: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isActive: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', isActive: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', isActive: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', isActive: true },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', isActive: true },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', isActive: true },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', isActive: true },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', isActive: true },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', isActive: true },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', isActive: true },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', isActive: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', isActive: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isActive: true },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', isActive: true },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', isActive: true },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', isActive: true },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', isActive: true },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', isActive: true },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', isActive: true },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', isActive: true },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български', isActive: true },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski', isActive: true },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina', isActive: true },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina', isActive: true },
];

interface TranslationItem {
  key: string;
  value: string;
  path: string;
}

const LanguageManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('tr');
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState<TranslationItem[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(50);

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      loadTranslations(selectedLanguage);
    }
  }, [selectedLanguage]);

  const fetchLanguages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://49.13.94.27/:3005/languages');
      if (response.ok) {
        const data = await response.json();
        setLanguages(Array.isArray(data) ? data : []);
      } else {
        const defaultLangs: Language[] = [
          { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', isActive: true },
          { code: 'en', name: 'English', nativeName: 'English', isActive: true },
        ];
        setLanguages(defaultLangs);
      }
    } catch (error) {
      console.error('Languages yüklenirken hata:', error);
      const defaultLangs: Language[] = [
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', isActive: true },
        { code: 'en', name: 'English', nativeName: 'English', isActive: true },
      ];
      setLanguages(defaultLangs);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTranslations = useCallback(async (langCode: string) => {
    try {
      setLoading(true);
      let translationsData: any = {};
      
      const savedTranslations = localStorage.getItem(`translations_${langCode}`);
      if (savedTranslations) {
        translationsData = JSON.parse(savedTranslations);
      } else {
        try {
          if (langCode === 'tr') {
            const trModule = await import(`../../i18n/locales/tr`);
            translationsData = trModule.default || {};
          } else if (langCode === 'en') {
            const enModule = await import(`../../i18n/locales/en`);
            translationsData = enModule.default || {};
          } else {
            try {
              const translationsModule = await import(`../../i18n/locales/${langCode}`);
              translationsData = translationsModule.default || {};
            } catch (importError) {
              const trModule = await import(`../../i18n/locales/tr`);
              translationsData = JSON.parse(JSON.stringify(trModule.default || {}));
            }
          }
        } catch (error) {
          console.error('Translations yüklenirken hata:', error);
          const trModule = await import(`../../i18n/locales/tr`);
          translationsData = JSON.parse(JSON.stringify(trModule.default || {}));
        }
      }
      
      setTranslations(translationsData);
      const flatList = flattenTranslations(translationsData);
      setTreeData(flatList);
    } catch (error) {
      console.error('Translations yüklenirken hata:', error);
      message.error('Çeviriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  const flattenTranslations = useCallback((obj: any, path: string[] = []): TranslationItem[] => {
    const items: TranslationItem[] = [];
    
    for (const key in obj) {
      const currentPath = [...path, key];
      const fullKey = currentPath.join('.');
      const value = obj[key];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        items.push(...flattenTranslations(value, currentPath));
      } else {
        items.push({
          key: fullKey,
          value: typeof value === 'string' ? value : JSON.stringify(value),
          path: fullKey,
        });
      }
    }
    
    return items;
  }, []);

  const filteredTranslations = useMemo(() => {
    if (!searchText) return treeData;
    const lowerSearch = searchText.toLowerCase();
    return treeData.filter(item => 
      item.key.toLowerCase().includes(lowerSearch) || 
      item.value.toLowerCase().includes(lowerSearch)
    );
  }, [treeData, searchText]);

  const handleSaveTranslation = useCallback(async (key: string, value: string) => {
    try {
      const keys = key.split('.');
      const newTranslations = { ...translations };
      let current = newTranslations;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      setTranslations(newTranslations);
      setEditingKey(null);
      
      // Update flat list
      const updatedList = treeData.map(item => 
        item.key === key ? { ...item, value } : item
      );
      setTreeData(updatedList);
      
      await saveTranslations(selectedLanguage, newTranslations);
      message.success('Çeviri kaydedildi');
    } catch (error) {
      console.error('Çeviri kaydedilirken hata:', error);
      message.error('Çeviri kaydedilirken bir hata oluştu');
    }
  }, [translations, treeData, selectedLanguage]);

  const saveTranslations = useCallback(async (langCode: string, translationsData: any) => {
    try {
      localStorage.setItem(`translations_${langCode}`, JSON.stringify(translationsData));
      await addLanguage(langCode, translationsData);
      
      try {
        await fetch(`http://49.13.94.27/:3005/translations/${langCode}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(translationsData),
        });
      } catch (error) {
        console.log('API bulunamadı, localStorage kullanılıyor');
      }
    } catch (error) {
      console.error('Translations kaydedilirken hata:', error);
    }
  }, []);

  const handleAddLanguage = useCallback(() => {
    setEditingLanguage(null);
    form.resetFields();
    setModalVisible(true);
  }, [form]);

  const handleLanguageSelect = useCallback((langCode: string) => {
    const selectedLang = AVAILABLE_LANGUAGES.find(l => l.code === langCode);
    if (selectedLang) {
      form.setFieldsValue({
        code: selectedLang.code,
        name: selectedLang.name,
        nativeName: selectedLang.nativeName,
        isActive: true,
      });
    }
  }, [form]);

  const handleEditLanguage = useCallback((lang: Language) => {
    setEditingLanguage(lang);
    form.setFieldsValue(lang);
    setModalVisible(true);
  }, [form]);

  const handleDeleteLanguage = useCallback(async (code: string) => {
    try {
      const response = await fetch(`http://49.13.94.27/:3005/languages/${code}`, {
        method: 'DELETE',
      });
      
      if (response.ok || response.status === 404) {
        setLanguages(languages.filter(l => l.code !== code));
        message.success('Dil silindi');
      }
    } catch (error) {
      console.error('Dil silinirken hata:', error);
      setLanguages(languages.filter(l => l.code !== code));
      message.success('Dil silindi');
    }
  }, [languages]);

  const handleSaveLanguage = useCallback(async (values: any) => {
    try {
      setLoading(true);
      
      const langData: Language = {
        code: values.code.toLowerCase(),
        name: values.name,
        nativeName: values.nativeName,
        isActive: values.isActive !== false,
      };

      if (editingLanguage) {
        const response = await fetch(`http://49.13.94.27/:3005/languages/${editingLanguage.code}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(langData),
        });
        
        if (response.ok || response.status === 404) {
          setLanguages(languages.map(l => l.code === editingLanguage.code ? langData : l));
          message.success('Dil güncellendi');
        }
      } else {
        const baseTranslations = await import(`../../i18n/locales/tr`);
        const newTranslations = JSON.parse(JSON.stringify(baseTranslations.default));
        
        await saveTranslations(langData.code, newTranslations);
        await addLanguage(langData.code, newTranslations);
        
        try {
          const response = await fetch('http://49.13.94.27/:3005/languages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(langData),
          });
          
          if (response.ok) {
            const savedLang = await response.json();
            setLanguages([...languages, savedLang]);
          } else {
            setLanguages([...languages, langData]);
          }
          message.success('Yeni dil eklendi ve çeviriler kopyalandı');
        } catch (error) {
          setLanguages([...languages, langData]);
          message.success('Yeni dil eklendi (offline mode)');
        }
      }
      
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Dil kaydedilirken hata:', error);
      message.error('Dil kaydedilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [editingLanguage, languages, form, saveTranslations]);

  const translationColumns: ColumnsType<TranslationItem> = useMemo(() => [
    {
      title: 'Çeviri Anahtarı',
      dataIndex: 'key',
      key: 'key',
      width: 300,
      fixed: 'left' as const,
      render: (text: string) => (
        <code style={{ 
          fontSize: '12px', 
          color: '#1890ff',
          backgroundColor: '#f0f0f0',
          padding: '2px 6px',
          borderRadius: '3px',
          wordBreak: 'break-all'
        }}>
          {text}
        </code>
      ),
    },
    {
      title: 'Çeviri Değeri',
      dataIndex: 'value',
      key: 'value',
      render: (text: string, record: TranslationItem) => {
        if (editingKey === record.key) {
          return (
            <div>
              <TextArea
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                rows={2}
                style={{ marginBottom: '8px' }}
                placeholder="Çeviri metnini girin..."
                autoFocus
              />
              <Space>
                <Button 
                  type="primary" 
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleSaveTranslation(record.key, editingValue)}
                >
                  Kaydet
                </Button>
                <Button 
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setEditingKey(null);
                    setEditingValue('');
                  }}
                >
                  İptal
                </Button>
              </Space>
            </div>
          );
        }
        return (
          <div 
            style={{ 
              padding: '8px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              minHeight: '32px',
              cursor: 'pointer',
              wordBreak: 'break-word',
              border: '1px solid #e8e8e8',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e6f7ff';
              e.currentTarget.style.borderColor = '#1890ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#e8e8e8';
            }}
            onClick={() => {
              setEditingKey(record.key);
              setEditingValue(record.value);
            }}
          >
            {text || <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>Boş - Düzenlemek için tıklayın</span>}
          </div>
        );
      },
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: TranslationItem) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            setEditingKey(record.key);
            setEditingValue(record.value);
          }}
        >
          Düzenle
        </Button>
      ),
    },
  ], [editingKey, editingValue, handleSaveTranslation]);

  const languageColumns: ColumnsType<Language> = useMemo(() => [
    {
      title: 'Dil Kodu',
      dataIndex: 'code',
      key: 'code',
      width: 100,
    },
    {
      title: 'Dil Adı',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Yerel Ad',
      dataIndex: 'nativeName',
      key: 'nativeName',
    },
    {
      title: 'Durum',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Aktif' : 'Pasif'}
        </Tag>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (_: any, record: Language) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditLanguage(record)}
          >
            Düzenle
          </Button>
          {record.code !== 'tr' && record.code !== 'en' && (
            <Popconfirm
              title="Bu dili silmek istediğinize emin misiniz?"
              onConfirm={() => handleDeleteLanguage(record.code)}
              okText="Evet"
              cancelText="Hayır"
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
              >
                Sil
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ], [handleEditLanguage, handleDeleteLanguage]);

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GlobalOutlined style={{ color: '#1890ff' }} />
              Dil Yönetimi
            </h2>
            <p style={{ margin: '8px 0 0 0', color: '#8c8c8c' }}>
              Çeviri içeriklerini yönetin ve yeni diller ekleyin
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddLanguage}
          >
            Yeni Dil Ekle
          </Button>
        </div>

        <Tabs
          activeKey={selectedLanguage}
          onChange={setSelectedLanguage}
          type="card"
        >
          {languages.map(lang => (
            <TabPane
              tab={
                <span>
                  {lang.nativeName} ({lang.code})
                  {lang.isActive && <Tag color="green" style={{ marginLeft: '8px' }}>Aktif</Tag>}
                </span>
              }
              key={lang.code}
            >
              <div style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0 }}>{lang.nativeName} Çevirileri</h3>
                    <Tag color="blue">{filteredTranslations.length} çeviri</Tag>
                  </div>
                  <Space>
                    <Input
                      placeholder="Çeviri ara..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{ width: 250 }}
                      allowClear
                    />
                    <InputNumber
                      min={10}
                      max={200}
                      step={10}
                      value={pageSize}
                      onChange={(val) => setPageSize(val || 50)}
                      addonBefore="Sayfa"
                      style={{ width: 120 }}
                    />
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setSearchText('');
                        loadTranslations(lang.code);
                      }}
                    >
                      Yenile
                    </Button>
                  </Space>
                </div>
                
                <Table
                  columns={translationColumns}
                  dataSource={filteredTranslations}
                  rowKey="key"
                  loading={loading}
                  pagination={{
                    pageSize: pageSize,
                    showSizeChanger: true,
                    showTotal: (total) => `Toplam ${total} çeviri`,
                    pageSizeOptions: ['10', '25', '50', '100', '200'],
                  }}
                  scroll={{ x: 800, y: 600 }}
                  size="small"
                />
              </div>
            </TabPane>
          ))}
        </Tabs>

        <Divider />

        <div>
          <h3>Diller</h3>
          <Table
            columns={languageColumns}
            dataSource={languages}
            rowKey="code"
            loading={loading}
            pagination={false}
          />
        </div>
      </Card>

      <Modal
        title={editingLanguage ? 'Dili Düzenle' : 'Yeni Dil Ekle'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveLanguage}
        >
          {!editingLanguage && (
            <Form.Item
              name="selectedLanguage"
              label="Dil Seçin"
              rules={[{ required: true, message: 'Lütfen bir dil seçin' }]}
            >
              <Select
                placeholder="Dil seçin..."
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) ||
                  (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleLanguageSelect}
                options={AVAILABLE_LANGUAGES
                  .filter(lang => !languages.some(l => l.code === lang.code))
                  .map(lang => ({
                    value: lang.code,
                    label: `${lang.nativeName} (${lang.name})`,
                    code: lang.code,
                  }))}
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}

          <Form.Item
            name="code"
            label="Dil Kodu (ISO 639-1)"
            rules={[
              { required: true, message: 'Dil kodu gerekli' },
              { pattern: /^[a-z]{2}$/, message: '2 harfli ISO kod giriniz (örn: tr, en, de)' },
            ]}
          >
            <Input 
              placeholder="tr, en, de, fr, es..." 
              disabled={true}
              maxLength={2}
            />
          </Form.Item>

          <Form.Item
            name="name"
            label="Dil Adı (İngilizce)"
            rules={[{ required: true, message: 'Dil adı gerekli' }]}
          >
            <Input 
              placeholder="Turkish, English, German..." 
              disabled={!editingLanguage}
            />
          </Form.Item>

          <Form.Item
            name="nativeName"
            label="Yerel Ad"
            rules={[{ required: true, message: 'Yerel ad gerekli' }]}
          >
            <Input 
              placeholder="Türkçe, English, Deutsch..." 
              disabled={!editingLanguage}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Durum"
            initialValue={true}
            rules={[{ required: true, message: 'Durum seçin' }]}
          >
            <Select placeholder="Durum seçin...">
              <Select.Option value={true}>Aktif</Select.Option>
              <Select.Option value={false}>Pasif</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Kaydet
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                İptal
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LanguageManagement;
