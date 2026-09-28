fetch("/api/categories")
    .then(response => response.json())
    .then(categories => {
        const categorySelect = document.getElementById("category");

        categories.forEach(category => {
            const option = document.createElement("option");

            option.value = category.category_id;
            option.textContent = category.category_name;

            categorySelect.appendChild(option);
        });
    });

let editingTransactionId = null;

document.getElementById("addButton").addEventListener("click", () => {
    const amount = document.getElementById("amount").value;
    const type = document.getElementById("type").value;
    const category_id = document.getElementById("category").value;
    const note = document.getElementById("note").value;

    const url = editingTransactionId
        ? `/api/transactions/${editingTransactionId}`
        : "/api/transactions";

    const method = editingTransactionId ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            amount,
            type,
            category_id,
            note
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            editingTransactionId = null;

            document.getElementById("amount").value = "";
            document.getElementById("category").value = "";
            document.getElementById("note").value = "";

            document.getElementById("addButton").textContent = "Add record";

            loadRecords();
            loadSummary();
        });
});


function loadRecords() {
    fetch("/api/transactions")
        .then(response => response.json())
        .then(transactions => {
            const recordList = document.getElementById("recordList");

            recordList.innerHTML = "";

            transactions.forEach(transaction => {
                const record = document.createElement("div");
                record.className = "record";

                record.innerHTML = `
                    <strong class="${transaction.type}">
                        ${transaction.category_name}
                    </strong>

                    <span>₹${transaction.amount}</span>

                    <p>${transaction.note || ""}</p>

                    <small>${new Date(transaction.transaction_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                })}</small>

                    <button class="edit-button" data-id="${transaction.transaction_id}">
                        Edit
                    </button>

                    <button class="delete-button" data-id="${transaction.transaction_id}">
                        Delete
                    </button>
                `;

                recordList.appendChild(record);
            });
        });
}


function loadSummary() {
    fetch("/api/summary")
        .then(response => response.json())
        .then(summary => {
            document.getElementById("balance").textContent =
                `₹${summary.balance}`;

            document.getElementById("income").textContent =
                `₹${summary.total_income}`;

            document.getElementById("expenses").textContent =
                `₹${summary.total_expense}`;
        });
}


document.addEventListener("click", (event) => {

    if (event.target.classList.contains("delete-button")) {

        const transactionId = event.target.dataset.id;

        const shouldDelete = confirm(
            "Are you sure you want to delete this record?"
        );

        if (!shouldDelete) {
            return;
        }

        fetch(`/api/transactions/${transactionId}`, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);

                loadRecords();
                loadSummary();
            });
    }


    if (event.target.classList.contains("edit-button")) {

        const transactionId = event.target.dataset.id;

        editingTransactionId = transactionId;

        document.getElementById("addButton").textContent = "Update record";

        fetch("/api/transactions")
            .then(response => response.json())
            .then(transactions => {

                const transaction = transactions.find(
                    item => item.transaction_id == transactionId
                );

                document.getElementById("amount").value = transaction.amount;
                document.getElementById("type").value = transaction.type;
                document.getElementById("category").value = transaction.category_id;
                document.getElementById("note").value = transaction.note || "";
            });
    }
});


loadRecords();
loadSummary();