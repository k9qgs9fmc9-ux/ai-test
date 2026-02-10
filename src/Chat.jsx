import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, addUserMessage, clearHistory, switchMode } from './features/chat/chatSlice';
import { Layout, Input, Button, Typography, Avatar, Spin, Space, Empty, Select, Tag, Modal, Tooltip } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, DeleteOutlined, ShopOutlined, PayCircleOutlined, RiseOutlined, SettingOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MODES, getModeConfig } from './data/modes';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('dashscope_api_key') || '');
  
  const dispatch = useDispatch();
  const { messages, status, error, mode } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  
  const currentConfig = getModeConfig(mode);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    dispatch(addUserMessage(inputValue));
    const newHistory = [...messages, { role: 'user', content: inputValue }];
    // Pass apiKey to sendMessage action
    dispatch(sendMessage({ messages: newHistory, apiKey }));
    setInputValue('');
  };

  const handleSaveSettings = () => {
    if (apiKey) {
      localStorage.setItem('dashscope_api_key', apiKey);
    } else {
      localStorage.removeItem('dashscope_api_key');
    }
    setIsSettingsOpen(false);
  };

  const handleClear = () => {
    dispatch(clearHistory());
  };
  
  const handleModeChange = (value) => {
    dispatch(switchMode(value));
  };

  const displayMessages = messages.filter(m => m.role !== 'system');

  return (
    <Layout style={{ height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Modal 
        title="Settings" 
        open={isSettingsOpen} 
        onOk={handleSaveSettings} 
        onCancel={() => setIsSettingsOpen(false)}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>DashScope API Key (Optional)</Text>
          <div style={{ marginTop: 8, color: '#666', fontSize: '12px', marginBottom: 8 }}>
            Required for static deployment (e.g., GitHub Pages). If not provided, the app will try to use the backend server.
          </div>
          <Input.Password 
            placeholder="sk-..." 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
          />
        </div>
      </Modal>

      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: '#001529',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {mode === MODES.FINANCE ? (
              <PayCircleOutlined style={{ fontSize: '24px', color: currentConfig.themeColor }} />
            ) : mode === MODES.STOCK ? (
              <RiseOutlined style={{ fontSize: '24px', color: currentConfig.themeColor }} />
            ) : (
              <ShopOutlined style={{ fontSize: '24px', color: currentConfig.themeColor }} />
            )}
            <Title level={4} style={{ color: 'white', margin: 0 }}>
              {currentConfig.name}
            </Title>
          </div>
          
          <Select 
            value={mode} 
            onChange={handleModeChange}
            style={{ width: 180, marginLeft: 8 }}
            className="mode-select"
            dropdownStyle={{ minWidth: 180 }}
            placeholder="Select Mode"
          >
            <Option value={MODES.PRODUCT}>
              <Space>
                <ShopOutlined /> Product Expert
              </Space>
            </Option>
            <Option value={MODES.FINANCE}>
              <Space>
                <PayCircleOutlined /> Financial Expert
              </Space>
            </Option>
            <Option value={MODES.STOCK}>
              <Space>
                <RiseOutlined /> Stock Expert
              </Space>
            </Option>
          </Select>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Tooltip title="Settings">
            <Button icon={<SettingOutlined />} onClick={() => setIsSettingsOpen(true)} ghost />
          </Tooltip>
          <Button icon={<DeleteOutlined />} onClick={handleClear} ghost>Clear</Button>
        </div>
      </Header>

      <Content style={{ 
        padding: '24px', 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '16px'
      }}>
        {displayMessages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <Empty description={false} />
            <Text type="secondary" style={{ fontSize: '16px' }}>
              Start a conversation with our <span style={{ color: currentConfig.themeColor, fontWeight: 'bold' }}>{currentConfig.name}</span>
            </Text>
            {mode === MODES.FINANCE && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Tag color="gold">Financial Analysis</Tag>
                <Tag color="gold">Investment Advice</Tag>
                <Tag color="gold">Tax Planning</Tag>
              </div>
            )}
            {mode === MODES.STOCK && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Tag color="red">Market Analysis</Tag>
                <Tag color="red">Technical Indicators</Tag>
                <Tag color="red">Risk Assessment</Tag>
              </div>
            )}
            {mode === MODES.PRODUCT && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Tag color="blue">Product Details</Tag>
                <Tag color="blue">Price Check</Tag>
                <Tag color="blue">Stock Info</Tag>
              </div>
            )}
          </div>
        ) : (
          displayMessages.map((item, index) => {
            const isUser = item.role === 'user';
            return (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                {!isUser && (
                  <Avatar 
                    icon={mode === MODES.FINANCE ? <PayCircleOutlined /> : mode === MODES.STOCK ? <RiseOutlined /> : <ShopOutlined />} 
                    style={{ backgroundColor: currentConfig.themeColor, flexShrink: 0 }} 
                  />
                )}
                
                <div style={{ 
                  maxWidth: '70%', 
                  backgroundColor: isUser ? currentConfig.themeColor : 'white',
                  color: isUser ? 'white' : 'rgba(0, 0, 0, 0.85)',
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  fontSize: '15px',
                  lineHeight: '1.6'
                }}>

                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                          <div style={{ 
                            backgroundColor: isUser ? 'rgba(0,0,0,0.2)' : '#f6f8fa', 
                            padding: '8px', 
                            borderRadius: '4px',
                            overflowX: 'auto',
                            margin: '8px 0'
                          }}>
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </div>
                        ) : (
                          <code style={{ 
                            backgroundColor: isUser ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.06)', 
                            padding: '2px 4px', 
                            borderRadius: '3px' 
                          }} {...props}>
                            {children}
                          </code>
                        )
                      },
                      p: ({children}) => <p style={{ margin: 0 }}>{children}</p>,
                      // Make sure links are visible
                      a: ({node, ...props}) => <a style={{ color: isUser ? '#e6f7ff' : '#1890ff', textDecoration: 'underline' }} {...props} />
                    }}
                  >
                    {item.content}
                  </ReactMarkdown>
                </div>

                {isUser && (
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ backgroundColor: '#87d068', flexShrink: 0 }} 
                  />
                )}
              </div>
            );
          })
        )}
        
        {status === 'loading' && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
             <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#1890ff' }} />
             <div style={{ 
               backgroundColor: 'white', 
               padding: '12px 20px', 
               borderRadius: '16px 16px 16px 4px',
               boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
             }}>
               <Spin size="small" /> <span style={{ marginLeft: 8, color: '#999' }}>Thinking...</span>
             </div>
          </div>
        )}
        
        {error && (
          <div style={{ 
            textAlign: 'center', 
            margin: '10px', 
            padding: '10px', 
            backgroundColor: '#fff1f0', 
            border: '1px solid #ffccc7', 
            borderRadius: '4px',
            color: '#cf1322'
          }}>
            Error: {typeof error === 'object' ? JSON.stringify(error) : error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </Content>
      
      <Footer style={{ 
        padding: '16px 24px', 
        backgroundColor: 'white', 
        borderTop: '1px solid #f0f0f0' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea 
              autoSize={{ minRows: 1, maxRows: 6 }}
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message here... (Shift+Enter for new line)" 
              disabled={status === 'loading'}
              style={{ borderRadius: '20px 0 0 20px', resize: 'none' }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={handleSend} 
              loading={status === 'loading'}
              style={{ height: 'auto', borderRadius: '0 20px 20px 0', padding: '0 24px' }}
            >
              Send
            </Button>
          </Space.Compact>
          <div style={{ textAlign: 'center', color: '#bfbfbf', fontSize: '12px', marginTop: '8px' }}>
            Powered by Qwen-Max via OpenAI SDK
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default Chat;
