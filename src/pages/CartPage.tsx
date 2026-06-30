import React from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import type { CartItem } from '../App';
import { Link } from 'react-router-dom';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, onUpdateQuantity, onRemove }) => {
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5 text-white">
        <h2>Giỏ hàng trống 🛒</h2>
        <p>Bạn chưa thêm bài hát nào vào giỏ hàng.</p>
        <Link to="/tracks">
          <Button variant="primary">Khám phá ngay</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-white">
      <h2 className="mb-4">Giỏ hàng của bạn</h2>
      <Table striped bordered hover variant="dark" responsive>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên sách (Bài hát)</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} className="align-middle">
              <td>
                <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
              </td>
              <td>
                <div><strong>{item.title}</strong></div>
                <div className="text-muted small">{item.artist}</div>
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button variant="outline-light" size="sm" onClick={() => onUpdateQuantity(item.id, -1)} disabled={item.quantity <= 1}>-</Button>
                  <span>{item.quantity}</span>
                  <Button variant="outline-light" size="sm" onClick={() => onUpdateQuantity(item.id, 1)} disabled={item.quantity >= item.stock}>+</Button>
                </div>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <Button variant="danger" size="sm" onClick={() => onRemove(item.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-end align-items-center gap-4 mt-4">
        <h4 className="mb-0">Tổng tiền: <span className="text-primary">${totalAmount.toFixed(2)}</span></h4>
        <Button variant="success" size="lg">Thanh toán</Button>
      </div>
    </Container>
  );
};

export default CartPage;
