import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles/DashboardPage.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage = () => {
    const navigate = useNavigate();
    const [despesas, setDespesas] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showChartPopup, setShowChartPopup] = useState(false);
    const [chartData, setChartData] = useState(null);
    const [selectedDespesa, setSelectedDespesa] = useState(null);
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [modoPagamento, setModoPagamento] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState("");

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token) {
        navigate("/");
    }

    const fetchDespesas = useCallback(async () => {
        try {
            const response = await axios.get(
                `http://localhost:5093/api/despesas?user=${username}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const sortedDespesas = response.data.sort(
                (a, b) => new Date(b.data) - new Date(a.data)
            );
            setDespesas(sortedDespesas);
        } catch (error) {
            console.error("Error fetching despesas:", error);
        }
    }, [username, token]);

    const fetchChartData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5093/api/despesas",
                {
                    params: { user: username },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const categoryTotals = response.data.reduce((totals, despesa) => {
                const { categoria, valor } = despesa;
                if (!totals[categoria]) totals[categoria] = 0;
                totals[categoria] += valor;
                return totals;
            }, {});

            setChartData({
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        label: "Dinheiro gasto",
                        data: Object.values(categoryTotals),
                        backgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56",
                            "#4BC0C0",
                            "#9966FF",
                            "#FF9F40",
                        ],
                    },
                ],
            });
        } catch (error) {
            console.error("Error fetching spending data:", error);
        }
    };

    useEffect(() => {
        fetchDespesas();
    }, [fetchDespesas]);

    const handleCreateDespesa = async () => {
        try {
            await axios.post(
                "http://localhost:5093/api/despesas",
                {
                    data,
                    categoria,
                    valor: parseFloat(valor),
                    modoPagamento,
                    descricao,
                    user: username,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Despesa criada com sucesso!");
            setShowPopup(false);
            fetchDespesas();
        } catch (error) {
            console.error("Erro ao criar despesa:", error);
            alert("Falha ao criar despesa.");
        }
    };

    const handleEditDespesa = async () => {
        try {
            await axios.put(
                `http://localhost:5093/api/despesas/${selectedDespesa.id}`,
                {
                    id: selectedDespesa.id,
                    data,
                    categoria,
                    valor: parseFloat(valor),
                    modoPagamento,
                    descricao,
                    user: username,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Despesa atualizada com sucesso!");
            setShowPopup(false);
            fetchDespesas();
        } catch (error) {
            console.error("Erro ao atualizar despesa:", error);
            alert("Falha ao atualizar despesa.");
        }
    };

    const handleDeleteDespesa = async () => {
        try {
            await axios.delete(
                `http://localhost:5093/api/despesas/${selectedDespesa.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Despesa apagada com sucesso!");
            setShowDeleteConfirm(false);
            fetchDespesas();
        } catch (error) {
            console.error("Erro ao apagar despesa:", error);
            alert("Falha ao apagar despesa.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/");
    };

    const handleShowChartPopup = async () => {
        await fetchChartData();
        setShowChartPopup(true);
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>Bem-vindo {username}</h1>
                <button className="logout-button" onClick={handleLogout}>
                    Sair
                </button>
            </div>

            <button
                className="create-expense-button"
                onClick={() => {
                    setSelectedDespesa(null);
                    setCategoria("");
                    setValor("");
                    setModoPagamento("");
                    setDescricao("");
                    setData("");
                    setShowPopup(true);
                }}
            >
                Criar Despesa
            </button>
            <button
                className="view-graph-button"
                onClick={handleShowChartPopup}
            >
                Gráfico de Despesas
            </button>

            {showChartPopup && chartData && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Despesas por categoria</h3>
                        <Pie data={chartData} width={200} height={200} />
                        <button onClick={() => setShowChartPopup(false)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            <table className="despesa-table">
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor (€)</th>
                        <th>Categoria</th>
                        <th>Data</th>
                        <th>Modo de Pagamento</th>
                        <th>Editar</th>
                        <th>Apagar</th>
                    </tr>
                </thead>
                <tbody>
                    {despesas.map((despesa) => (
                        <tr key={despesa.id}>
                            <td>{despesa.descricao}</td>
                            <td>{despesa.valor} €</td>
                            <td>{despesa.categoria}</td>
                            <td>
                                {new Date(despesa.data).toLocaleDateString(
                                    "pt-PT"
                                )}
                            </td>
                            <td>{despesa.modoPagamento}</td>
                            <td>
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        setSelectedDespesa(despesa);
                                        setCategoria(despesa.categoria);
                                        setValor(despesa.valor);
                                        setModoPagamento(despesa.modoPagamento);
                                        setDescricao(despesa.descricao);
                                        setData(despesa.data);
                                        setShowPopup(true);
                                    }}
                                >
                                    Editar
                                </button>
                            </td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => {
                                        setSelectedDespesa(despesa);
                                        setShowDeleteConfirm(true);
                                    }}
                                >
                                    Apagar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>
                            {selectedDespesa
                                ? "Editar Despesa"
                                : "Criar Despesa"}
                        </h3>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Descrição"
                            required
                        />
                        <input
                            type="number"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder="Valor"
                            required
                        />
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            <option value="Alimentação">Alimentação</option>
                            <option value="Transporte">Transporte</option>
                            <option value="Saúde">Saúde</option>
                            <option value="Lazer">Lazer</option>
                            <option value="Educação">Educação</option>
                            <option value="Outros">Outros</option>
                        </select>
                        <select
                            value={modoPagamento}
                            onChange={(e) => setModoPagamento(e.target.value)}
                            required
                        >
                            <option value="">
                                Selecione o modo de pagamento
                            </option>
                            <option value="Cartão de Crédito">
                                Cartão de Crédito
                            </option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Transferência Bancária">
                                Transferência Bancária
                            </option>
                            <option value="MB Way">MB Way</option>
                        </select>
                        <input
                            type="date"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            required
                        />
                        <div>
                            <button
                                onClick={
                                    selectedDespesa
                                        ? handleEditDespesa
                                        : handleCreateDespesa
                                }
                            >
                                {selectedDespesa ? "Atualizar" : "Criar"}
                            </button>
                            <button onClick={() => setShowPopup(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Tem certeza que deseja apagar esta despesa?</p>
                        <button id="sim" onClick={handleDeleteDespesa}>
                            Apagar Despesa
                        </button>
                        <button
                            id="nao"
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
