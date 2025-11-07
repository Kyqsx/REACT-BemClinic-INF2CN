// src/pages/Profile.js
import React, { useState } from 'react';
import { useAuth } from '../../utils/useAuth'; // Importando useAuth
import '../../styles/perfil.css';

function Profile() {
    const { user } = useAuth(); // Obtendo o usuário autenticado
    const [name, setName] = useState(user ? user.name : '');
    const [email, setEmail] = useState(user ? user.email : '');
    const [isEditing, setEditing] = useState(false);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = () => {
        // Aqui você pode adicionar a lógica para salvar as informações do usuário
        console.log("Salvando informações:", { name, email });
        setEditing(false);
    };

    return (
        <div className='profile'>
            <div className="profile-container">
                <div className='profile-card'>
                    <h1>Perfil</h1>
                    <div className="profile-info">
                        <label>
                            Nome:
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            ) : (
                                <span>{name}</span>
                            )}
                        </label>
                        <label>
                            Email:
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            ) : (
                                <span>{email}</span>
                            )}
                        </label>
                    </div>
                    <div className="profile-actions">
                        {isEditing ? (
                            <button onClick={handleSave}>Salvar</button>
                        ) : (
                            <button onClick={handleEdit}>Editar</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
