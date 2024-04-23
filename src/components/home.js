import React, { useEffect, useState } from "react";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    userId: "",
    id: "",
    title: "",
  });
  const [isAddUser, setIsAddUser] = useState(false);

  useEffect(() => {
    getUsersDetail();
  }, []);

  const getUsersDetail = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/albums"
      );
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (itemId) => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/albums/${itemId}`, {
        method: "DELETE",
      });
      setUsers(users.filter((user) => user.id !== itemId));
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = (user) => {
    setSelectedUser(user);
    setEditedUser(user);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await fetch("https://jsonplaceholder.typicode.com/albums", {
        method: "POST",
        body: JSON.stringify({
          title: editedUser.title,
          userId: editedUser.userId,
          id: editedUser.id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      setUsers((users) => [editedUser, ...users]);
    } catch (err) {
      console.log(err);
    } finally {
      setIsAddUser(false);
      setEditedUser({ userId: "", id: "", title: "" });
    }
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(
        `https://jsonplaceholder.typicode.com/albums/${selectedUser.id}`,
        {
          method: "PUT",
          body: JSON.stringify(editedUser),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );
      setUsers(
        users.map((user) => (user.id === selectedUser.id ? editedUser : user))
      );
      
    } catch (error) {
      console.log(error);
    }finally{
      setSelectedUser(null);
      setEditedUser({ userId: "", id: "", title: "" });
    }
  };

  return (
    <>
      <div className="title">
        <div>
          <h2>album list</h2>
          <div className="underline"></div>
        </div>
        <button className="addNewAlbumBtn" onClick={() => setIsAddUser(true)}>
          Add New Album
        </button>
      </div>

      <div className="section-center">
        {users.map((person, index) => {
          return (
            <div key={index}>
              <article className="album-item">
                <div className="item-info">
                  <header className="id">
                    <h4>User-Id: {person.userId}</h4>
                    <h4 className="identity">Id: {person.id}</h4>
                  </header>
                  <p className="item-text">
                    <span>title:</span> {person.title}
                  </p>
                  <div className="btn-container">
                    <button onClick={() => updateUser(person)}>update</button>
                    <button onClick={() => deleteUser(person.id)}>
                      delete
                    </button>
                  </div>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {selectedUser && (
        <div className="form-container">
          <h4 className="title">Edit Album</h4>
          <form onSubmit={handleSubmit}>
            <label className="userid">
              User ID:
              <input
                type="text"
                name="userId"
                value={editedUser.userId}
                onChange={handleInputChange}
              />
            </label>
            <label className="id">
              ID:
              <input
                type="text"
                name="id"
                value={editedUser.id}
                onChange={handleInputChange}
              />
            </label>
            <label className="para">
              Title:
              <input
                className="titleInput"
                type="text"
                name="title"
                value={editedUser.title}
                onChange={handleInputChange}
              />
            </label>
            <div className="btn-container">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setSelectedUser(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {isAddUser && (
        <div className="form-container">
          <h4 className="title">Add New Album</h4>
          <form onSubmit={handleAddUser}>
            <label className="userid">
              User ID:
              <input type="text" name="userId" onChange={handleInputChange} />
            </label>
            <label className="id">
              ID:
              <input type="text" name="id" onChange={handleInputChange} />
            </label>
            <label className="para">
              Title:
              <input
                className="titleInput"
                type="text"
                name="title"
                onChange={handleInputChange}
              />
            </label>
            <div className="btn-container">
              <button type="submit">Add</button>
              <button type="button" onClick={() => setIsAddUser(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
export default Home;
