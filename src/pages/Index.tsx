import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  status: 'processing' | 'shipped' | 'in_transit' | 'delivered';
  trackingNumber: string;
  items: CartItem[];
  total: number;
  estimatedDelivery: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: string;
}

const Index = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currentSection, setCurrentSection] = useState<'catalog' | 'orders' | 'cart' | 'chat' | 'profile' | 'notifications' | 'payments' | 'favorites'>('catalog');
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Здравствуйте! Чем могу помочь?', sender: 'support', timestamp: '14:30' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const products: Product[] = [
    { id: 1, name: 'Беспроводные наушники Pro', price: 12990, category: 'Электроника', image: '🎧', inStock: true },
    { id: 2, name: 'Умные часы X5', price: 24990, category: 'Гаджеты', image: '⌚', inStock: true },
    { id: 3, name: 'Портативная колонка Bass', price: 5990, category: 'Аудио', image: '🔊', inStock: true },
    { id: 4, name: 'Игровая мышь RGB', price: 3490, category: 'Компьютеры', image: '🖱️', inStock: true },
    { id: 5, name: 'Механическая клавиатура', price: 8990, category: 'Компьютеры', image: '⌨️', inStock: false },
    { id: 6, name: 'Веб-камера HD Pro', price: 6990, category: 'Компьютеры', image: '📷', inStock: true },
  ];

  const orders: Order[] = [
    {
      id: 'ORD-2024-001',
      status: 'in_transit',
      trackingNumber: 'TR1234567890',
      items: [
        { ...products[0], quantity: 1 }
      ],
      total: 12990,
      estimatedDelivery: '15 января 2026'
    }
  ];

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const toggleFavorite = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage('');
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: 'Спасибо за сообщение! Наш специалист ответит в ближайшее время.',
          sender: 'support',
          timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }
  };

  const getStatusProgress = (status: Order['status']) => {
    switch (status) {
      case 'processing': return 25;
      case 'shipped': return 50;
      case 'in_transit': return 75;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'processing': return 'Обрабатывается';
      case 'shipped': return 'Отправлен';
      case 'in_transit': return 'В пути';
      case 'delivered': return 'Доставлен';
      default: return 'Неизвестно';
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🛍️</div>
            <h1 className="text-xl font-semibold">ShopHub</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'catalog', label: 'Каталог', icon: 'Store' },
              { id: 'orders', label: 'Заказы', icon: 'Package' },
              { id: 'favorites', label: 'Избранное', icon: 'Heart' },
              { id: 'notifications', label: 'Уведомления', icon: 'Bell' },
              { id: 'payments', label: 'Платежи', icon: 'CreditCard' },
              { id: 'profile', label: 'Профиль', icon: 'User' },
            ].map(section => (
              <Button
                key={section.id}
                variant={currentSection === section.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentSection(section.id as any)}
                className="gap-2"
              >
                <Icon name={section.icon as any} size={16} />
                <span className="hidden lg:inline">{section.label}</span>
              </Button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover-scale"
            >
              <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatOpen(true)}
              className="hover-scale relative"
            >
              <Icon name="MessageCircle" size={20} />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                2
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(true)}
              className="hover-scale relative"
            >
              <Icon name="ShoppingCart" size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="md:hidden border-t">
          <div className="container flex items-center justify-around py-2 px-4">
            {[
              { id: 'catalog', icon: 'Store' },
              { id: 'orders', icon: 'Package' },
              { id: 'favorites', icon: 'Heart' },
              { id: 'profile', icon: 'User' },
            ].map(section => (
              <Button
                key={section.id}
                variant={currentSection === section.id ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setCurrentSection(section.id as any)}
              >
                <Icon name={section.icon as any} size={20} />
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="container py-6 px-4 animate-fade-in">
        {currentSection === 'catalog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Каталог товаров</h2>
              <Badge variant="secondary" className="text-sm">
                {products.length} товаров
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden animate-scale-in hover-scale">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="text-6xl">{product.image}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(product.id)}
                        className={favorites.includes(product.id) ? 'text-red-500' : ''}
                      >
                        <Icon name="Heart" size={20} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold">{product.price.toLocaleString('ru-RU')} ₽</span>
                      <Button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        size="sm"
                      >
                        <Icon name="ShoppingCart" size={16} className="mr-1" />
                        {product.inStock ? 'В корзину' : 'Нет в наличии'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentSection === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Мои заказы</h2>

            {orders.map(order => (
              <Card key={order.id} className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Заказ {order.id}</h3>
                    <p className="text-sm text-muted-foreground">Трек-номер: {order.trackingNumber}</p>
                  </div>
                  <Badge className="text-sm">{getStatusText(order.status)}</Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Статус доставки</span>
                    <span className="font-medium">Ожидаемая дата: {order.estimatedDelivery}</span>
                  </div>
                  <Progress value={getStatusProgress(order.status)} className="h-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Обработка</span>
                    <span>Отправлен</span>
                    <span>В пути</span>
                    <span>Доставлен</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  {order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{item.image}</div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Количество: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold">{item.price.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">Итого:</span>
                  <span className="text-2xl font-bold">{order.total.toLocaleString('ru-RU')} ₽</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {currentSection === 'favorites' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Избранное</h2>

            {favorites.length === 0 ? (
              <Card className="p-12 text-center space-y-4">
                <Icon name="Heart" size={48} className="mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Вы ещё не добавили товары в избранное</p>
                <Button onClick={() => setCurrentSection('catalog')}>Перейти в каталог</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => favorites.includes(p.id)).map(product => (
                  <Card key={product.id} className="overflow-hidden animate-scale-in hover-scale">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="text-6xl">{product.image}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFavorite(product.id)}
                          className="text-red-500"
                        >
                          <Icon name="Heart" size={20} fill="currentColor" />
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                        <Badge variant="outline" className="text-xs">{product.category}</Badge>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-bold">{product.price.toLocaleString('ru-RU')} ₽</span>
                        <Button onClick={() => addToCart(product)} size="sm">
                          <Icon name="ShoppingCart" size={16} className="mr-1" />
                          В корзину
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {currentSection === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Профиль</h2>

            <Card className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">АП</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">Алексей Петров</h3>
                  <p className="text-muted-foreground">alexey@example.com</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium">Имя</label>
                    <Input defaultValue="Алексей" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Фамилия</label>
                    <Input defaultValue="Петров" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input defaultValue="alexey@example.com" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Телефон</label>
                    <Input defaultValue="+7 (999) 123-45-67" className="mt-1" />
                  </div>
                </div>

                <Button className="w-full">Сохранить изменения</Button>
              </div>
            </Card>
          </div>
        )}

        {currentSection === 'notifications' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Уведомления</h2>

            <Card className="divide-y">
              {[
                { icon: 'Package', title: 'Заказ отправлен', text: 'Ваш заказ ORD-2024-001 был отправлен', time: '2 часа назад' },
                { icon: 'Tag', title: 'Новая акция', text: 'Скидка 20% на всю электронику до конца недели', time: '5 часов назад' },
                { icon: 'Bell', title: 'Товар в наличии', text: 'Механическая клавиатура снова в продаже', time: '1 день назад' },
              ].map((notification, idx) => (
                <div key={idx} className="p-4 flex gap-4 hover:bg-accent/50 transition-colors">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name={notification.icon as any} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {currentSection === 'payments' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Способы оплаты</h2>

            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon name="CreditCard" size={24} className="text-primary" />
                  <div>
                    <p className="font-medium">•••• 4242</p>
                    <p className="text-sm text-muted-foreground">Visa</p>
                  </div>
                </div>
                <Badge>Основная</Badge>
              </div>

              <Button variant="outline" className="w-full">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить карту
              </Button>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold">История платежей</h3>
              <div className="space-y-3">
                {[
                  { date: '10 янв 2026', amount: 12990, status: 'Успешно' },
                  { date: '05 янв 2026', amount: 5990, status: 'Успешно' },
                ].map((payment, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.amount.toLocaleString('ru-RU')} ₽</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                    </div>
                    <Badge variant="outline">{payment.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Icon name="ShoppingCart" size={24} />
              Корзина
            </SheetTitle>
          </SheetHeader>

          <div className="mt-8 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Корзина пуста</p>
                <Button onClick={() => { setCartOpen(false); setCurrentSection('catalog'); }}>
                  Перейти в каталог
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {cart.map(item => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-4">
                        <div className="text-4xl">{item.image}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Количество: {item.quantity}</p>
                          <p className="font-semibold mt-2">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Итого:</span>
                    <span>{cartTotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <Button className="w-full" size="lg">
                    Оформить заказ
                  </Button>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={chatOpen} onOpenChange={setChatOpen}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Icon name="MessageCircle" size={24} />
              Чат поддержки
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 mt-8 space-y-4 overflow-y-auto">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex gap-2">
            <Input
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} size="icon">
              <Icon name="Send" size={20} />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Index;