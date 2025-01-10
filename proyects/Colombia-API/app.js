const API_BASE = 'https://api-colombia.com/api/v1';
        let allLocations = [];

        const searchInput = document.getElementById('searchInput');
        const autocompleteList = document.getElementById('autocompleteList');
        const loader = document.getElementById('loader');
        const results = document.getElementById('results');
        const errorMessage = document.getElementById('errorMessage');
        const mainResult = document.getElementById('mainResult');
        const locationName = document.getElementById('locationName');
        const populationInfo = document.getElementById('populationInfo');
        const departmentInfo = document.getElementById('departmentInfo');
        const municipalitiesList = document.getElementById('municipalitiesList');
        const municipalitiesGrid = document.getElementById('municipalitiesGrid');

        async function fetchInitialData() {
            try {
                showLoader();
                const [depsResponse, citiesResponse] = await Promise.all([
                    fetch(`${API_BASE}/Department`),
                    fetch(`${API_BASE}/City`)
                ]);
                const departments = await depsResponse.json();
                const cities = await citiesResponse.json();

                allLocations = [
                    ...departments.map(dep => ({ ...dep, type: 'department' })),
                    ...cities.map(city => ({ 
                        ...city, 
                        type: city.cityType === 'Ciudad' ? 'city' : 'municipality'
                    }))
                ];
                hideLoader();
            } catch (error) {
                console.error('Error fetching initial data:', error);
                showError('Error al cargar los datos. Por favor, intenta de nuevo más tarde.');
                hideLoader();
            }
        }

        

        function handleInput() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm.length < 2) {
                autocompleteList.innerHTML = '';
                autocompleteList.classList.add('hidden');
                return;
            }

            const matches = allLocations.filter(location => 
                location.name.toLowerCase().includes(searchTerm)
            ).slice(0, 10);

            if (matches.length > 0) {
                autocompleteList.innerHTML = matches.map(location => `
                    <li class="px-4 py-2 hover:bg-emerald-100 cursor-pointer" data-id="${location.id}" data-type="${location.type}">
                        ${location.name} (${getLocationType(location.type)})
                    </li>
                `).join('');
                autocompleteList.classList.remove('hidden');
            } else {
                autocompleteList.innerHTML = '';
                autocompleteList.classList.add('hidden');
            }
        }

        function getLocationType(type) {
            switch (type) {
                case 'department': return 'Departamento';
                case 'city': return 'Ciudad';
                case 'municipality': return 'Municipio';
                default: return 'Desconocido';
            }
        }

        function handleAutocompleteClick(e) {
            if (e.target.tagName === 'LI') {
                const id = e.target.dataset.id;
                const type = e.target.dataset.type;
                const location = allLocations.find(loc => loc.id === parseInt(id) && loc.type === type);
                if (location) {
                    searchInput.value = location.name;
                    autocompleteList.classList.add('hidden');
                    showLocationInfo(location);
                }
            }
        }

        function showLocationInfo(location) {
            clearResults();
            showLoader();

            if (location.type === 'department') {
                showDepartmentInfo(location);
            } else {
                showCityOrMunicipalityInfo(location);
            }

            hideLoader();
            results.classList.remove('hidden');
        }

        function showDepartmentInfo(department) {
            mainResult.classList.remove('hidden');
            locationName.textContent = department.name;
            populationInfo.textContent = `Población total: ${formatNumber(department.population)} habitantes`;

            municipalitiesList.classList.remove('hidden');
            const departmentLocations = allLocations.filter(loc => 
                (loc.type === 'city' || loc.type === 'municipality') && loc.departmentId === department.id
            );
            
            municipalitiesGrid.innerHTML = departmentLocations
                .map(location => `
                    <div class="bg-emerald-100 p-4 rounded-lg">
                        <h4 class="font-semibold text-emerald-800">${location.name}</h4>
                        <p class="text-emerald-600">${formatPopulation(location.population)}</p>
                        <p class="text-emerald-500 text-sm">${getLocationType(location.type)}</p>
                    </div>
                `)
                .join('');
        }

        function showCityOrMunicipalityInfo(location) {
            mainResult.classList.remove('hidden');
            locationName.textContent = location.name;
            populationInfo.textContent = `Población total: ${formatPopulation(location.population)}`;
            
            const locationDepartment = allLocations.find(loc => loc.type === 'department' && loc.id === location.departmentId);
            if (locationDepartment) {
                departmentInfo.textContent = `Pertenece al departamento de ${locationDepartment.name}`;
            }
        }

        function showLoader() {
            loader.classList.remove('hidden');
        }

        function hideLoader() {
            loader.classList.add('hidden');
        }

        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
        }

        function clearResults() {
            errorMessage.classList.add('hidden');
            mainResult.classList.add('hidden');
            municipalitiesList.classList.add('hidden');
            municipalitiesGrid.innerHTML = '';
            departmentInfo.textContent = '';
        }

        function formatNumber(num) {
            return new Intl.NumberFormat('es-CO').format(num);
        }

        function formatPopulation(population) {
            if (population === 0 || population === null || population === undefined) {
                return "Población no disponible";
            }
            return `${formatNumber(population)} habitantes`;
        }

        searchInput.addEventListener('input', handleInput);
        autocompleteList.addEventListener('click', handleAutocompleteClick);

        fetchInitialData();