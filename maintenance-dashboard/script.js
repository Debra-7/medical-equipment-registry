
        /*
        *Request verified maintenance events from the backend.
        */
       async function loadMaintenanceEvents() {
        const container = 
            document.getElementById('events-container');

        try {
            const response = 
                await fetch('/api/maintenance-events');

            if (!response.ok) {
                throw new Error('Failed to retrieve maintenance events');
            }

            const events = await response.json();

            // Display a message if there are no events.
            if (events.length === 0) {

                container.innerHTML = 
                    '<p class = "empty">No maintenance events received.</p>';
                return;
            }

            // Clear the loading message.
            container.innerHTML = '';

            // Create a card for each maintenance event.
            events.forEach(event => {

                const equipment = event.equipment;

                const eventElement = document.createElement('article');

                eventElement.className = 'event-card';

                eventElement.innerHTML = `
                    <div class = "event-header">

                        <div>
                            <h3>${equipment.name}</h3>

                            <span class = "equipment-id">${equipment.id}</span>
                        </div>

                        <span class = "equipment-status">
                            ${equipment.status}
                        </span>
                    </div>

                    <div class = "equipment-details">

                        <div>
                            <span>Department</span>
                            <strong>${equipment.department}</strong>
                        </div>

                        <div>
                            <span>Location</span>
                            <strong>${equipment.location}</strong>
                        </div>

                        <div>
                            <span>Technician</span>
                            <strong>${equipment.technician}</strong>
                        </div>

                        <div>
                            <span>Last Maintenance Date</span>
                            <strong>${equipment.lastMaintenanceDate}</strong>
                        </div>

                        <div>
                            <span>Next Maintenance Date</span>
                            <strong>${equipment.nextMaintenanceDate}</strong>
                        </div>

                    </div>

                    <div class = "verification">
                         ✓ Webhook signature verified
                    </div>
                `;

                container.appendChild(eventElement);
            });
        } catch (error) {
            console.error('Dashboard Error:', error);
            container.innerHTML = 
                '<p class = "error">Error loading maintenance events. Please try again later.</p>';
        }
    }

    //Load events when the page is loaded.

    loadMaintenanceEvents();

