import React, { useState } from 'react';

interface Item {
  id: number;
  name: string;
  active: boolean;
}

interface ManagementTemplateProps {
  title: string;
  placeholder: string;
  addButtonLabel?: string;
}

const ManagementTemplate: React.FC<ManagementTemplateProps> = ({
  title,
  placeholder,
  addButtonLabel = 'Upload',
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const handleAdd = () => {
    if (input.trim() === '') return;
    if (editId !== null) {
      setItems(items.map(item => item.id === editId ? { ...item, name: input } : item));
      setEditId(null);
    } else {
      setItems([
        ...items,
        { id: Date.now(), name: input, active: true },
      ]);
    }
    setInput('');
  };

  const handleEdit = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setInput(item.name);
      setEditId(id);
    }
  };

  const handleDelete = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleToggle = (id: number) => {
    setItems(items.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  const handleReset = () => {
    setInput('');
    setEditId(null);
  };

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-2 items-center">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          className="bg-green-600 text-white px-4 py-1 rounded"
          onClick={handleAdd}
        >
          +{addButtonLabel}+
        </button>
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded"
          onClick={handleAdd}
        >
          Submit
        </button>
        <button
          className="bg-black text-white px-4 py-1 rounded"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{title} List</h3>
        <input
          className="border rounded px-2 py-1"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Sl No.</th>
            <th className="p-2">{title} Name</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, idx) => (
            <tr key={item.id} className="border-t">
              <td className="p-2 text-center">{idx + 1}</td>
              <td className="p-2">{item.name}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  className="bg-yellow-400 p-1 rounded"
                  onClick={() => handleEdit(item.id)}
                  title="Edit"
                >
                  <span role="img" aria-label="edit">✏️</span>
                </button>
                <button
                  className="bg-pink-500 text-white p-1 rounded"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <span role="img" aria-label="delete">🗑️</span>
                </button>
                <button
                  className={`p-1 rounded-full ${item.active ? 'bg-pink-400' : 'bg-gray-300'}`}
                  onClick={() => handleToggle(item.id)}
                  title="Toggle Active"
                >
                  <span role="img" aria-label="toggle">{item.active ? '🔴' : '⚪'}</span>
                </button>
              </td>
            </tr>
          ))}
          {filteredItems.length === 0 && (
            <tr>
              <td colSpan={3} className="p-2 text-center text-gray-400">No data found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManagementTemplate;
