// Sortable and Filterable Table Library
const SortableFilterableTable = {
    /**
     * Creates a sortable and filterable table.
     * @param {string} containerId - The ID of the container where the table will be inserted.
     * @param {Array} data - The data to display in the table (array of objects).
     * @param {Array} columns - The columns configuration (array of objects with `key`, `header`, and `type` properties).
     */
    createTable: function (containerId, data, columns) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found.`);
            return;
        }

        // Create the table element
        const table = document.createElement('table');
        table.id = 'dataTable';
        table.innerHTML = `
            <thead>
                <tr class="filter-row">
                    ${columns.map((col, index) => `
                        <th>
                            <input type="text" class="filter-input" onkeyup="SortableFilterableTable.filterColumn(${index})" placeholder="Filter ${col.header}">
                        </th>
                    `).join('')}
                </tr>
                <tr>
                    ${columns.map((col, index) => `
                        <th onclick="SortableFilterableTable.sortTable(${index}, '${col.type || 'text'}')">${col.header}</th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.map((row) => `
                    <tr>
                        ${columns.map((col) => `
                            <td>${row[col.key]}</td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        `;

        // Clear the container and append the table
        container.innerHTML = '';
        container.appendChild(table);
    },

    /**
     * Sorts the table by a specific column.
     * @param {number} n - The column index to sort by.
     * @param {string} type - The type of data in the column ('text' or 'date').
     */
    sortTable: function (n, type = 'text') {
        const table = document.getElementById('dataTable');
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        // Determine the sort direction
        const isAscending = !table.getAttribute('data-sort-asc');
        table.setAttribute('data-sort-asc', isAscending ? 'true' : 'false');

        // Sort the rows
        rows.sort((rowA, rowB) => {
            const x = rowA.querySelectorAll('td')[n].textContent.toLowerCase();
            const y = rowB.querySelectorAll('td')[n].textContent.toLowerCase();
            let xContent = x;
            let yContent = y;

            if (type === 'date') {
                xContent = new Date(x);
                yContent = new Date(y);
            }

            if (isAscending) {
                return xContent > yContent ? 1 : -1;
            } else {
                return xContent < yContent ? 1 : -1;
            }
        });

        // Re-append the sorted rows to the table
        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';
        rows.forEach((row) => tbody.appendChild(row));
    },

    /**
     * Filters the table by a specific column.
     * @param {number} n - The column index to filter by.
     */
    filterColumn: function (n) {
        const input = document.querySelectorAll('.filter-input')[n];
        const filter = input.value.toUpperCase();
        const table = document.getElementById('dataTable');
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach((row) => {
            const td = row.querySelectorAll('td')[n];
            if (td) {
                const txtValue = td.textContent || td.innerText;
                row.style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? '' : 'none';
            }
        });
    }
};

// Export the library
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SortableFilterableTable; // For Node.js/CommonJS
} else {
    window.SortableFilterableTable = SortableFilterableTable; // For browser
}
