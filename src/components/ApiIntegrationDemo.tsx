import React, { useState } from 'react';
import { useCategories, useUsers } from '../hooks/useApi';
import * as apiServiceModule from '../services/apiService';

const ApiIntegrationDemo: React.FC = () => {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'other',
    icon: '📦',
    color: '#B0B0B0'
  });
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiServiceModule.apiService.createCategory(newCategory);
      // Refresh categories after creation
      // In a real app, you would use a mutation pattern or refetch
      alert('Category created successfully!');
    } catch (error) {
      alert('Failed to create category');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiServiceModule.apiService.createUser(newUser);
      // Refresh users after creation
      // In a real app, you would use a mutation pattern or refetch
      alert('User created successfully!');
    } catch (error) {
      alert('Failed to create user');
    }
  };

  if (categoriesLoading || usersLoading) return <div>Loading...</div>;
  if (categoriesError || usersError) return <div>Error: {categoriesError || usersError}</div>;

  return (
    <div className="api-demo">
      <h2>API Integration Demo</h2>
      
      <div className="section">
        <h3>Categories</h3>
        <ul>
          {categories.map(category => (
            <li key={category.id}>
              <span style={{ color: category.color }}>{category.icon}</span> {category.name} ({category.type})
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>Users</h3>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.username} ({user.email}) - {user.is_admin ? 'Admin' : 'User'}
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>Create New Category</h3>
        <form onSubmit={handleCreateCategory}>
          <input
            type="text"
            placeholder="Category name"
            value={newCategory.name}
            onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Category type"
            value={newCategory.type}
            onChange={(e) => setNewCategory({...newCategory, type: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Icon"
            value={newCategory.icon}
            onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
          />
          <input
            type="color"
            value={newCategory.color}
            onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
          />
          <button type="submit">Create Category</button>
        </form>
      </div>

      <div className="section">
        <h3>Create New User</h3>
        <form onSubmit={handleCreateUser}>
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            required
          />
          <button type="submit">Create User</button>
        </form>
      </div>
    </div>
  );
};

export default ApiIntegrationDemo;