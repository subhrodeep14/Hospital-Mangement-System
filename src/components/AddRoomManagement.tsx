

import React, { useState } from 'react';

interface Bed {
  id: number;
  name: string;
  isEditing?: boolean;
}

interface Room {
  id: number;
  name: string;
  beds: Bed[];
  active: boolean;
  isEditing?: boolean;
}

const AddRoomManagement: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomInput, setRoomInput] = useState('');
  const [editRoomId, setEditRoomId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [bedInputs, setBedInputs] = useState<{ [roomId: number]: string }>({});
  const [editBedInputs, setEditBedInputs] = useState<{ [roomId: number]: { [bedId: number]: string } }>({});

  // Room handlers
  const handleAddRoom = () => {
    if (roomInput.trim() === '') return;
    if (editRoomId !== null) {
      setRooms(rooms.map(room => room.id === editRoomId ? { ...room, name: roomInput, isEditing: false } : room));
      setEditRoomId(null);
    } else {
      setRooms([
        ...rooms,
        { id: Date.now(), name: roomInput, beds: [], active: true },
      ]);
    }
    setRoomInput('');
  };

  const handleEditRoom = (id: number) => {
    const room = rooms.find(r => r.id === id);
    if (room) {
      setRoomInput(room.name);
      setEditRoomId(id);
      setRooms(rooms.map(r => r.id === id ? { ...r, isEditing: true } : { ...r, isEditing: false }));
    }
  };

  const handleSaveRoomEdit = (id: number) => {
    setRooms(rooms.map(room => room.id === id ? { ...room, name: roomInput, isEditing: false } : room));
    setEditRoomId(null);
    setRoomInput('');
  };

  const handleCancelRoomEdit = () => {
    setEditRoomId(null);
    setRoomInput('');
    setRooms(rooms.map(r => ({ ...r, isEditing: false })));
  };

  const handleDeleteRoom = (id: number) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const handleToggleRoom = (id: number) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  // Bed handlers
  const handleBedInputChange = (roomId: number, value: string) => {
    setBedInputs({ ...bedInputs, [roomId]: value });
  };

  const handleAddBed = (roomId: number) => {
    const bedName = bedInputs[roomId]?.trim();
    if (!bedName) return;
    setRooms(rooms.map(room =>
      room.id === roomId
        ? { ...room, beds: [...room.beds, { id: Date.now(), name: bedName }] }
        : room
    ));
    setBedInputs({ ...bedInputs, [roomId]: '' });
  };

  const handleEditBed = (roomId: number, bedId: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    const bed = room.beds.find(b => b.id === bedId);
    if (!bed) return;
    setEditBedInputs({
      ...editBedInputs,
      [roomId]: {
        ...(editBedInputs[roomId] || {}),
        [bedId]: bed.name,
      },
    });
    setRooms(rooms.map(r =>
      r.id === roomId
        ? { ...r, beds: r.beds.map(b => b.id === bedId ? { ...b, isEditing: true } : { ...b, isEditing: false }) }
        : r
    ));
  };

  const handleSaveBedEdit = (roomId: number, bedId: number) => {
    const newName = editBedInputs[roomId]?.[bedId]?.trim();
    if (!newName) return;
    setRooms(rooms.map(room =>
      room.id === roomId
        ? {
            ...room,
            beds: room.beds.map(bed => bed.id === bedId ? { ...bed, name: newName, isEditing: false } : bed),
          }
        : room
    ));
    setEditBedInputs({
      ...editBedInputs,
      [roomId]: {
        ...(editBedInputs[roomId] || {}),
        [bedId]: '',
      },
    });
  };

  const handleCancelBedEdit = (roomId: number, bedId: number) => {
    setRooms(rooms.map(room =>
      room.id === roomId
        ? {
            ...room,
            beds: room.beds.map(bed => bed.id === bedId ? { ...bed, isEditing: false } : bed),
          }
        : room
    ));
    setEditBedInputs({
      ...editBedInputs,
      [roomId]: {
        ...(editBedInputs[roomId] || {}),
        [bedId]: '',
      },
    });
  };

  const handleDeleteBed = (roomId: number, bedId: number) => {
    setRooms(rooms.map(room =>
      room.id === roomId
        ? { ...room, beds: room.beds.filter(bed => bed.id !== bedId) }
        : room
    ));
  };

  const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Room & Bed Management</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6 flex flex-col md:flex-row gap-2 items-center">
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Enter Room Name or Number"
              value={roomInput}
              onChange={e => setRoomInput(e.target.value)}
              disabled={editRoomId !== null}
            />
            {editRoomId !== null ? (
              <>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => handleSaveRoomEdit(editRoomId)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={handleCancelRoomEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={handleAddRoom}
                >
                  +Upload Room+
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handleAddRoom}
                >
                  Submit
                </button>
                <button
                  className="bg-black text-white px-4 py-2 rounded"
                  onClick={handleCancelRoomEdit}
                >
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-lg">Rooms List</h3>
          <input
            className="border rounded px-3 py-2 w-64"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Sl No.</th>
                <th className="p-3">Room Name/Number</th>
                <th className="p-3">Beds</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((room, idx) => (
                <tr key={room.id} className="border-t align-top">
                  <td className="p-3 text-center font-semibold">{idx + 1}</td>
                  <td className="p-3">
                    {room.isEditing ? (
                      <input
                        className="border rounded px-2 py-1 w-full"
                        value={roomInput}
                        onChange={e => setRoomInput(e.target.value)}
                      />
                    ) : (
                      <span>{room.name}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="space-y-2">
                      <div className="flex gap-2 mb-2">
                        <input
                          className="border rounded px-2 py-1"
                          placeholder="Add Bed Number/Details"
                          value={bedInputs[room.id] || ''}
                          onChange={e => handleBedInputChange(room.id, e.target.value)}
                        />
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded"
                          onClick={() => handleAddBed(room.id)}
                        >
                          Add Bed
                        </button>
                      </div>
                      <ul className="list-disc pl-4">
                        {room.beds.map(bed => (
                          <li key={bed.id} className="flex items-center gap-2 mb-1">
                            {bed.isEditing ? (
                              <>
                                <input
                                  className="border rounded px-2 py-1"
                                  value={editBedInputs[room.id]?.[bed.id] || ''}
                                  onChange={e => setEditBedInputs({
                                    ...editBedInputs,
                                    [room.id]: {
                                      ...(editBedInputs[room.id] || {}),
                                      [bed.id]: e.target.value,
                                    },
                                  })}
                                />
                                <button
                                  className="bg-blue-600 text-white px-2 py-1 rounded"
                                  onClick={() => handleSaveBedEdit(room.id, bed.id)}
                                >
                                  Save
                                </button>
                                <button
                                  className="bg-gray-400 text-white px-2 py-1 rounded"
                                  onClick={() => handleCancelBedEdit(room.id, bed.id)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <span>{bed.name}</span>
                                <button
                                  className="bg-yellow-400 p-1 rounded"
                                  onClick={() => handleEditBed(room.id, bed.id)}
                                  title="Edit Bed"
                                >
                                  <span role="img" aria-label="edit">✏️</span>
                                </button>
                                <button
                                  className="bg-pink-500 text-white p-1 rounded"
                                  onClick={() => handleDeleteBed(room.id, bed.id)}
                                  title="Delete Bed"
                                >
                                  <span role="img" aria-label="delete">🗑️</span>
                                </button>
                              </>
                            )}
                          </li>
                        ))}
                        {room.beds.length === 0 && (
                          <li className="text-gray-400">No beds</li>
                        )}
                      </ul>
                    </div>
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    {room.isEditing ? (
                      <>
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded"
                          onClick={() => handleSaveRoomEdit(room.id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                          onClick={handleCancelRoomEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-yellow-400 p-1 rounded"
                          onClick={() => handleEditRoom(room.id)}
                          title="Edit Room"
                        >
                          <span role="img" aria-label="edit">✏️</span>
                        </button>
                        <button
                          className="bg-pink-500 text-white p-1 rounded"
                          onClick={() => handleDeleteRoom(room.id)}
                          title="Delete Room"
                        >
                          <span role="img" aria-label="delete">🗑️</span>
                        </button>
                        <button
                          className={`p-1 rounded-full ${room.active ? 'bg-pink-400' : 'bg-gray-300'}`}
                          onClick={() => handleToggleRoom(room.id)}
                          title="Toggle Active"
                        >
                          <span role="img" aria-label="toggle">{room.active ? '🔴' : '⚪'}</span>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRooms.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-400">No data found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddRoomManagement;
