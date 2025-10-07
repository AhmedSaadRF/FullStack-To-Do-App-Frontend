import axios from "axios";

const baseUrl = "http://localhost:5000";  // Remove trailing slash

// Improve getAllToDo with async/await and error handling
export const getAllToDo = async (setToDo) => {
  try {
    const { data } = await axios.get(baseUrl);
    console.log('data ---> ', data);
    setToDo(data);
    return data;
  } catch (error) {
    console.error('Error fetching todos:', error.message);
    setToDo([]);  // Set empty array on error
    throw error;
  }
};

export const addToDo = async (text, setText, setToDo) => {
  try {
    if (!text || text.trim() === '') {
      throw new Error('Todo text cannot be empty');
    }

    const { data } = await axios.post(`${baseUrl}/save`, {
      text: text.trim()
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (data) {
      setText('');
      await getAllToDo(setToDo);
      return data;
    }
  } catch (error) {
    console.error('Error adding todo:', error.message);
    throw error;
  }
}

export const updateToDo = async (toDoId, text, setToDo, setText, setIsUpdating) => {
  try {
    // Wait for the update request to complete
    const { data } = await axios.put(`${baseUrl}/update`, {
      _id: toDoId,
      text: text.trim()
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Clear form and reset updating state
    setText('');
    setIsUpdating(false);

    // Refresh the todo list
    await getAllToDo(setToDo);

    // Return the updated data instead of just text
    return data;
  } catch (error) {
    console.error('Error updating todo:', error.message);
    setIsUpdating(false);
    throw error;
  }
};

export const deleteToDo = async (toDoId, setToDo) => {
  try {
    await axios.delete(`${baseUrl}/delete`, {
      data: {
        _id: toDoId
      }
    });

    await getAllToDo(setToDo);
  } catch (error) {
    console.error('Error deleting todo:', error.message);
    throw error;
  }
};
