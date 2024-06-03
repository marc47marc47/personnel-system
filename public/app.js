document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form");
    const nameInput = document.getElementById("name");
    const ageInput = document.getElementById("age");
    const positionInput = document.getElementById("position");
    const list = document.getElementById("list");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = nameInput.value;
        const age = ageInput.value;
        const position = positionInput.value;

        if (name && age && position) {
            await addEmployee(name, age, position);
            form.reset();
            await loadEmployees();
        }
    });

    const addEmployee = async (name, age, position) => {
        await fetch('/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, age, position })
        });
    };

    const deleteEmployee = async (id) => {
        await fetch(`/employees/${id}`, {
            method: 'DELETE'
        });
        await loadEmployees();
    };

    const loadEmployees = async () => {
        const response = await fetch('/employees');
        const employees = await response.json();
        list.innerHTML = '';
        employees.forEach(emp => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emp.name}</td>
                <td>${emp.age}</td>
                <td>${emp.position}</td>
                <td class="actions">
                    <button class="delete" data-id="${emp.id}">刪除</button>
                </td>
            `;
            tr.querySelector(".delete").addEventListener("click", () => deleteEmployee(emp.id));
            list.appendChild(tr);
        });
    };

    loadEmployees();
});

