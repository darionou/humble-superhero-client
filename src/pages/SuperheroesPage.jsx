import React, { useState, useEffect } from 'react';
import './SuperheroesPage.css';

const SuperheroesPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    superpower: '',
    humilityScore: '',
  });

  const [superheroes, setSuperheroes] = useState([]);
  const fetchSuperheroes = async () => {
    try {
      const response = await fetch('http://localhost:4000/superheroes');
      if (!response.ok) {
        throw new Error('Failed to fetch superheroes');
      }
      const data = await response.json();
      setSuperheroes(data);
    } catch (error) {
      console.error('Error fetching superheroes:', error);
    }
  };

  useEffect(() => {
    fetchSuperheroes();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const humilityScoreNumber = Number(formData.humilityScore);
    if (isNaN(humilityScoreNumber) || humilityScoreNumber < 1 || humilityScoreNumber > 10) {
      alert('Humility score must be a number between 1 and 10.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/superheroes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: formData.name,
          superpower: formData.superpower,
          humilityScore: humilityScoreNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add superhero');
      }

      setFormData({
        name: '',
        superpower: '',
        humilityScore: '',
      });

      fetchSuperheroes();
    } catch (error) {
      console.error('Error adding superhero:', error);
    }
  };

  return (
    <div className="superhero-container">
      <h1>Humble Superhero API</h1>
      
      <form className="superhero-form" onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Superpower:</label>
          <input 
            name="superpower" 
            value={formData.superpower} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label>Humility Score (1-10):</label>
          <input 
            name="humilityScore" 
            value={formData.humilityScore} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit">Add Superhero</button>
      </form>

      <div className="superhero-list">
        <h2>Superheroes List</h2>
        <ul>
          {superheroes.map((hero) => (
            <li key={hero.id}>
              <strong>{hero.name}</strong> - {hero.superpower} (Humility: {hero.humilityScore})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuperheroesPage;
