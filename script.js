fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('audio-container');
    const select = document.getElementById('category-select');

    // Add 'See All Categories' option and make it the default
    const allOption = document.createElement('option');
    allOption.value = "All";
    allOption.textContent = "See All Categories";
    allOption.selected = true;
    select.appendChild(allOption);

    // Add all unique categories
    const categories = [...new Set(data.map(item => item.category))];
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      select.appendChild(option);
    });

    // Render function for both single and all categories
    function renderCategory(selectedCategory) {
      container.innerHTML = '';

      const renderItems = (filtered) => {
        const subcategories = [...new Set(filtered.map(item => item.subcategory))];
        subcategories.forEach(sub => {
          const subHeader = document.createElement('h3');
          subHeader.textContent = sub;
          container.appendChild(subHeader);

          filtered
            .filter(item => item.subcategory === sub)
            .forEach(item => {
              const div = document.createElement('div');
              div.className = 'audio-item';

              const kono = document.createElement('p');
              kono.textContent = item.kono;

              const english = document.createElement('p');
              english.textContent = item.english;

              const audio = document.createElement('audio');
              audio.controls = true;
              audio.src = item.audio;

              const link = document.createElement('button');
              link.textContent = `View in Overleaf`;
              link.style.marginTop = '0.5rem';
              link.addEventListener('click', () => {
                const modal = document.getElementById('modal');
                const modalBody = document.getElementById('modal-body');
                modalBody.innerHTML = `
                  <p>This link will open in a new tab:</p>
                  <a href="${item.overleaf_link}" target="_blank" style="color: blue; text-decoration: underline;">
                    ${item.overleaf_link}
                  </a>
                `;
                modal.style.display = 'block';
              });

              div.appendChild(kono);
              div.appendChild(english);
              div.appendChild(audio);
              div.appendChild(link);
              container.appendChild(div);
            });
        });
      };

      if (selectedCategory === "All") {
        const allCategories = [...new Set(data.map(item => item.category))];
        allCategories.forEach(cat => {
          const filtered = data.filter(item => item.category === cat);
          if (filtered.length === 0) return;

          const catHeading = document.createElement('h2');
          catHeading.textContent = cat;
          catHeading.style.marginTop = "2rem";
          container.appendChild(catHeading);

          const date = filtered[0].date;
          const dateHeading = document.createElement('h3');
          dateHeading.textContent = `Date: ${date}`;
          container.appendChild(dateHeading);

          renderItems(filtered);
        });
      } else {
        const filtered = data.filter(item => item.category === selectedCategory);
        if (filtered.length === 0) {
          container.innerHTML = '<p>No entries found for this category.</p>';
          return;
        }

        const date = filtered[0].date;
        const dateHeading = document.createElement('h2');
        dateHeading.textContent = `Date: ${date}`;
        container.appendChild(dateHeading);

        renderItems(filtered);
      }
    }

    // Initial render: show all by default
    renderCategory("All");

    // Change listener
    select.addEventListener('change', e => {
      renderCategory(e.target.value);
    });

    // Modal close functionality
    document.querySelector('.close-button').addEventListener('click', () => {
      document.getElementById('modal').style.display = 'none';
      document.getElementById('modal-body').innerHTML = '';
    });

    // Close modal when clicking outside the content
    window.addEventListener('click', (event) => {
      const modal = document.getElementById('modal');
      if (event.target === modal) {
        modal.style.display = 'none';
        document.getElementById('modal-body').innerHTML = '';
      }
    });
  })
  .catch(err => {
    console.error('Error loading data:', err);
    const container = document.getElementById('audio-container');
    container.innerHTML = '<p>Error loading audio data. Please try again later.</p>';
  });
