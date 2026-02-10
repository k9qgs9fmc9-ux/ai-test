import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, addUserMessage, clearHistory, switchMode } from './features/chat/chatSlice';
import { Input, Button, Typography, Avatar, Tooltip, Modal, Dropdown, Space, Empty, Tag } from 'antd';
import { SendOutlined, UserOutlined, SettingOutlined, DeleteOutlined, ShopOutlined, PayCircleOutlined, RiseOutlined, HeartFilled, DownOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import HeartBackground from './components/HeartBackground';
import { MODES, getModeConfig } from './data/modes';

const { TextArea } = Input;
const { Title, Text } = Typography;

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('dashscope_api_key') || '');
  
  const dispatch = useDispatch();
  const { messages, status, mode } = useSelector((state) => state.chat);
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
  
  const handleModeChange = ({ key }) => {
    dispatch(switchMode(key));
  };

  const modeMenuProps = {
    items: [
      {
        key: MODES.PRODUCT,
        label: (
          <Space>
            <ShopOutlined style={{ color: '#ff7a9e' }} /> Product Expert
          </Space>
        ),
      },
      {
        key: MODES.FINANCE,
        label: (
          <Space>
            <PayCircleOutlined style={{ color: '#ff7a9e' }} /> Financial Expert
          </Space>
        ),
      },
      {
        key: MODES.STOCK,
        label: (
          <Space>
            <RiseOutlined style={{ color: '#ff7a9e' }} /> Stock Expert
          </Space>
        ),
      },
    ],
    onClick: handleModeChange,
  };

  const displayMessages = messages.filter(m => m.role !== 'system');

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
    }}>
      {/* Background Animation */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)' }}></div>
      <HeartBackground />

      {/* Settings Modal */}
      <Modal 
        title="Settings" 
        open={isSettingsOpen} 
        onOk={handleSaveSettings} 
        onCancel={() => setIsSettingsOpen(false)}
        centered
        styles={{ mask: { backdropFilter: 'blur(5px)' } }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong>DashScope API Key (Optional)</Text>
          <div style={{ marginTop: 8, color: '#666', fontSize: '12px', marginBottom: 8 }}>
            Required for static deployment.
          </div>
          <Input.Password 
            placeholder="sk-..." 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
          />
        </div>
      </Modal>

      {/* Main Container */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px'
      }}>
        
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            width: '100%', 
            maxWidth: '1000px',
            marginBottom: '20px',
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}
        >
          <Dropdown menu={modeMenuProps} trigger={['click']}>
            <Button type="text" style={{ height: 'auto', padding: '4px 8px' }}>
              <Space>
                {mode === MODES.FINANCE ? (
                  <PayCircleOutlined style={{ fontSize: '24px', color: '#ff7a9e' }} />
                ) : mode === MODES.STOCK ? (
                  <RiseOutlined style={{ fontSize: '24px', color: '#ff7a9e' }} />
                ) : (
                  <ShopOutlined style={{ fontSize: '24px', color: '#ff7a9e' }} />
                )}
                <Title level={4} style={{ margin: 0, color: '#555' }}>
                  {currentConfig.name} <DownOutlined style={{ fontSize: '14px', verticalAlign: 'middle' }}/>
                </Title>
              </Space>
            </Button>
          </Dropdown>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Tooltip title="Settings">
              <Button 
                shape="circle" 
                icon={<SettingOutlined />} 
                onClick={() => setIsSettingsOpen(true)} 
                style={{ border: 'none', background: 'rgba(255,255,255,0.5)', color: '#ff7a9e' }}
              />
            </Tooltip>
            <Tooltip title="Clear Chat">
              <Button 
                shape="circle" 
                icon={<DeleteOutlined />} 
                onClick={handleClear} 
                style={{ border: 'none', background: 'rgba(255,255,255,0.5)', color: '#ff7a9e' }}
              />
            </Tooltip>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div style={{ 
          flex: 1, 
          width: '100%', 
          maxWidth: '1000px', 
          overflowY: 'auto', 
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none',  /* IE 10+ */
        }}>
          <AnimatePresence>
            {displayMessages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}
              >
                <HeartFilled style={{ fontSize: '64px', color: '#fff', filter: 'drop-shadow(0 0 10px rgba(255, 122, 158, 0.5))', marginBottom: '20px' }} />
                <Title level={3} style={{ color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Waiting for your words...</Title>
              </motion.div>
            ) : (
              displayMessages.map((item, index) => {
                const isUser = item.role === 'user';
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ 
                      display: 'flex', 
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      gap: '12px',
                      marginBottom: '10px'
                    }}
                  >
                    {!isUser && (
                      <Avatar 
                        size="large"
                        icon={mode === MODES.FINANCE ? <PayCircleOutlined /> : mode === MODES.STOCK ? <RiseOutlined /> : <ShopOutlined />} 
                        style={{ 
                          backgroundColor: '#fff', 
                          color: '#ff7a9e',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }} 
                      />
                    )}
                    
                    <div style={{ 
                      maxWidth: '75%', 
                      background: isUser ? 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      color: isUser ? 'white' : '#333',
                      padding: '16px 24px',
                      borderRadius: isUser ? '24px 24px 4px 24px' : '24px 24px 24px 4px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      fontSize: '16px',
                      lineHeight: '1.6',
                      border: '1px solid rgba(255,255,255,0.5)'
                    }}>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, inline, className, children, ...props}) {
                            return (
                              <code className={className} {...props} style={{ 
                                background: 'rgba(0,0,0,0.06)', 
                                padding: '2px 4px', 
                                borderRadius: '4px',
                                color: 'inherit'
                              }}>
                                {children}
                              </code>
                            )
                          }
                        }}
                      >
                        {item.content}
                      </ReactMarkdown>
                    </div>

                    {isUser && (
                      <Avatar 
                        size="large"
                        icon={<UserOutlined />} 
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }} 
                      />
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ 
            width: '100%', 
            maxWidth: '1000px', 
            padding: '20px 0',
            position: 'relative'
          }}
        >
          <div style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRadius: '30px',
            padding: '8px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'flex-end',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            <TextArea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              bordered={false}
              style={{ 
                resize: 'none', 
                padding: '12px 20px', 
                fontSize: '16px',
                background: 'transparent'
              }}
            />
            <Button 
              type="primary" 
              shape="circle" 
              icon={<SendOutlined />} 
              onClick={handleSend}
              size="large"
              style={{ 
                margin: '4px',
                background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                border: 'none',
                boxShadow: '0 4px 10px rgba(255, 154, 158, 0.4)'
              }}
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Chat;
