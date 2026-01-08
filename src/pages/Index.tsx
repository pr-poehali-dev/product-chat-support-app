import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Employee {
  id: number;
  name: string;
  position: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  email: string;
  phone: string;
  department: string;
  joinDate: string;
}

interface ChatMessage {
  id: number;
  text: string;
  senderId: number;
  timestamp: string;
  edited?: boolean;
  attachments?: { type: 'image' | 'file'; name: string; url: string; }[];
}

interface Chat {
  employeeId: number;
  messages: ChatMessage[];
}

const Index = () => {
  const currentUserId = 1;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'Анна Смирнова', position: 'Директор', avatar: '👩‍💼', status: 'online', email: 'anna@company.ru', phone: '+7 (999) 111-11-11', department: 'Управление', joinDate: '01.01.2020' },
    { id: 2, name: 'Дмитрий Козлов', position: 'Менеджер по продажам', avatar: '👨‍💼', status: 'online', email: 'dmitry@company.ru', phone: '+7 (999) 222-22-22', department: 'Продажи', joinDate: '15.03.2021' },
    { id: 3, name: 'Елена Петрова', position: 'Бухгалтер', avatar: '👩‍💻', status: 'away', email: 'elena@company.ru', phone: '+7 (999) 333-33-33', department: 'Финансы', joinDate: '10.06.2021' },
    { id: 4, name: 'Игорь Морозов', position: 'Специалист поддержки', avatar: '👨‍🔧', status: 'online', email: 'igor@company.ru', phone: '+7 (999) 444-44-44', department: 'Поддержка', joinDate: '20.09.2022' },
    { id: 5, name: 'Ольга Волкова', position: 'HR-менеджер', avatar: '👩‍🎓', status: 'offline', email: 'olga@company.ru', phone: '+7 (999) 555-55-55', department: 'HR', joinDate: '05.02.2023' },
  ]);

  const [chats, setChats] = useState<Chat[]>([
    {
      employeeId: 2,
      messages: [
        { id: 1, text: 'Привет! Как дела с новым клиентом?', senderId: 2, timestamp: '10:30' },
        { id: 2, text: 'Отлично! Подписали договор вчера', senderId: 1, timestamp: '10:32' },
        { id: 3, text: 'Супер! Отправлю документы на email', senderId: 2, timestamp: '10:35' },
      ]
    },
    {
      employeeId: 3,
      messages: [
        { id: 1, text: 'Добрый день! Нужны счета за декабрь', senderId: 1, timestamp: '09:15' },
        { id: 2, text: 'Здравствуйте! Сейчас подготовлю, отправлю через час', senderId: 3, timestamp: '09:20' },
      ]
    }
  ]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(2);
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Employee | null>(null);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteCode] = useState('TEAM-2026-' + Math.random().toString(36).substr(2, 6).toUpperCase());
  const [searchQuery, setSearchQuery] = useState('');

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);
  const currentChat = chats.find(c => c.employeeId === selectedEmployeeId);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedEmployeeId) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      text: newMessage,
      senderId: currentUserId,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    setChats(prev => {
      const existingChat = prev.find(c => c.employeeId === selectedEmployeeId);
      if (existingChat) {
        return prev.map(c => 
          c.employeeId === selectedEmployeeId 
            ? { ...c, messages: [...c.messages, newMsg] }
            : c
        );
      } else {
        return [...prev, { employeeId: selectedEmployeeId, messages: [newMsg] }];
      }
    });

    setNewMessage('');
  };

  const editMessage = (messageId: number) => {
    if (!editingText.trim()) return;

    setChats(prev => prev.map(chat => ({
      ...chat,
      messages: chat.messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, text: editingText, edited: true }
          : msg
      )
    })));

    setEditingMessageId(null);
    setEditingText('');
  };

  const deleteMessage = (messageId: number) => {
    setChats(prev => prev.map(chat => ({
      ...chat,
      messages: chat.messages.filter(msg => msg.id !== messageId)
    })));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedEmployeeId) return;

    const file = files[0];
    const attachment = {
      type,
      name: file.name,
      url: URL.createObjectURL(file)
    };

    const newMsg: ChatMessage = {
      id: Date.now(),
      text: type === 'image' ? '📷 Изображение' : '📎 ' + file.name,
      senderId: currentUserId,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      attachments: [attachment]
    };

    setChats(prev => {
      const existingChat = prev.find(c => c.employeeId === selectedEmployeeId);
      if (existingChat) {
        return prev.map(c => 
          c.employeeId === selectedEmployeeId 
            ? { ...c, messages: [...c.messages, newMsg] }
            : c
        );
      } else {
        return [...prev, { employeeId: selectedEmployeeId, messages: [newMsg] }];
      }
    });
  };

  const openProfile = (employee: Employee) => {
    setSelectedProfile(employee);
    setProfileDialogOpen(true);
  };

  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: Employee['status']) => {
    switch (status) {
      case 'online': return 'В сети';
      case 'away': return 'Отошёл';
      case 'offline': return 'Не в сети';
      default: return 'Неизвестно';
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="flex h-screen">
        <aside className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="text-2xl">💬</div>
                <h1 className="text-xl font-bold text-gray-900">TeamChat</h1>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setInviteDialogOpen(true)}
                className="hover-scale"
              >
                <Icon name="UserPlus" size={20} />
              </Button>
            </div>

            <div className="relative">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Поиск сотрудников..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredEmployees.map(employee => (
                <button
                  key={employee.id}
                  onClick={() => setSelectedEmployeeId(employee.id)}
                  className={`w-full p-3 rounded-lg flex items-center gap-3 transition-all hover-scale ${
                    selectedEmployeeId === employee.id 
                      ? 'bg-purple-100 shadow-sm' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <div className="text-3xl">{employee.avatar}</div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(employee.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-sm text-gray-900 truncate">{employee.name}</p>
                    <p className="text-xs text-gray-500 truncate">{employee.position}</p>
                  </div>
                  {currentChat && currentChat.messages.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {currentChat.messages.length}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        <main className="flex-1 flex flex-col bg-gray-50">
          {selectedEmployee ? (
            <>
              <header className="bg-white border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="text-4xl">{selectedEmployee.avatar}</div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusColor(selectedEmployee.status)}`} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">{selectedEmployee.name}</h2>
                    <p className="text-sm text-gray-500">{getStatusText(selectedEmployee.status)} • {selectedEmployee.position}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openProfile(selectedEmployee)}
                  className="gap-2"
                >
                  <Icon name="Info" size={18} />
                  Профиль
                </Button>
              </header>

              <ScrollArea className="flex-1 p-6">
                <div className="max-w-3xl mx-auto space-y-4">
                  {currentChat?.messages.map(message => {
                    const isOwn = message.senderId === currentUserId;
                    const sender = employees.find(e => e.id === message.senderId);

                    return (
                      <div key={message.id} className={`flex gap-3 animate-fade-in ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <div className="text-2xl flex-shrink-0">{sender?.avatar}</div>
                        
                        <div className={`flex-1 ${isOwn ? 'flex justify-end' : ''}`}>
                          <div className={`inline-block max-w-md ${isOwn ? 'bg-purple-600 text-white' : 'bg-white border'} rounded-2xl p-4 shadow-sm`}>
                            {editingMessageId === message.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="min-h-[60px]"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => editMessage(message.id)}>
                                    Сохранить
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingMessageId(null)}>
                                    Отмена
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                                
                                {message.attachments && message.attachments.map((att, idx) => (
                                  <div key={idx} className="mt-2">
                                    {att.type === 'image' ? (
                                      <img src={att.url} alt={att.name} className="rounded-lg max-w-xs" />
                                    ) : (
                                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg">
                                        <Icon name="File" size={20} />
                                        <span className="text-xs">{att.name}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}

                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                                  <span className={`text-xs ${isOwn ? 'text-purple-200' : 'text-gray-500'}`}>
                                    {message.timestamp}
                                    {message.edited && ' • изменено'}
                                  </span>
                                  
                                  {isOwn && (
                                    <div className="flex gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => {
                                          setEditingMessageId(message.id);
                                          setEditingText(message.text);
                                        }}
                                      >
                                        <Icon name="Pencil" size={12} />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => deleteMessage(message.id)}
                                      >
                                        <Icon name="Trash2" size={12} />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="bg-white border-t p-4">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-end gap-2">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'image')}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'file')}
                    />

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => imageInputRef.current?.click()}
                      className="flex-shrink-0"
                    >
                      <Icon name="Image" size={20} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-shrink-0"
                    >
                      <Icon name="Paperclip" size={20} />
                    </Button>

                    <Textarea
                      placeholder="Введите сообщение..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      className="flex-1 min-h-[44px] max-h-[120px] resize-none"
                    />

                    <Button
                      size="icon"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="flex-shrink-0 h-11 w-11"
                    >
                      <Icon name="Send" size={20} />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Enter — отправить, Shift+Enter — новая строка
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl">💬</div>
                <h3 className="text-xl font-semibold text-gray-700">Выберите сотрудника</h3>
                <p className="text-gray-500">Начните общение с коллегами</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Профиль сотрудника</DialogTitle>
          </DialogHeader>

          {selectedProfile && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="text-6xl">{selectedProfile.avatar}</div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(selectedProfile.status)}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedProfile.name}</h3>
                  <p className="text-gray-600">{selectedProfile.position}</p>
                  <Badge variant="outline" className="mt-1">{getStatusText(selectedProfile.status)}</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedProfile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Телефон</p>
                  <p className="font-medium">{selectedProfile.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Отдел</p>
                  <p className="font-medium">{selectedProfile.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Дата присоединения</p>
                  <p className="font-medium">{selectedProfile.joinDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Пригласить в команду</DialogTitle>
            <DialogDescription>
              Отправьте этот код новому сотруднику для присоединения
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="p-6 bg-purple-50 border-purple-200">
              <p className="text-center text-2xl font-mono font-bold text-purple-900 tracking-wider">
                {inviteCode}
              </p>
            </Card>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(inviteCode);
                }}
              >
                <Icon name="Copy" size={16} className="mr-2" />
                Скопировать код
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.open(`mailto:?subject=Приглашение в TeamChat&body=Ваш код приглашения: ${inviteCode}`);
                }}
              >
                <Icon name="Mail" size={16} />
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Как это работает:</p>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Скопируйте код приглашения</li>
                <li>Отправьте его новому сотруднику</li>
                <li>Сотрудник использует код при регистрации</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
