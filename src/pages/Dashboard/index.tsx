import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Foods {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}
interface AddFood {
  name: string;
  description: string;
  price: string;
  image: string;
}

function Dashboard() {
  const [foods, setFoods] = useState<Foods[]>([]);
  const [editingFood, setEditingFood] = useState<Foods>({} as Foods);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    api.get('/foods').then((response) => setFoods(response.data));
  }, []);

  function toggleModal() {
    if (!isModalOpen) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }

  function toggleEditModal() {
    if (!isEditModalOpen) {
      setIsEditModalOpen(true);
    } else {
      setIsEditModalOpen(false);
    }
  }

  const handleAddFood = async (food: AddFood): Promise<void> => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditFood = (food: Foods) => {
    setIsEditModalOpen(true);
    setEditingFood(food);
  };

  const handleUpdateFood = async (food: AddFood): Promise<void> => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods.map((food) => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
