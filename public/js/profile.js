const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector('#favor-title').value.trim();
  const description = document.querySelector('#favor-desc').value.trim();
  const difficulty = $('#favor-difficulty').children("option:selected").val();
  console.log(title);
  console.log(description);
  console.log(difficulty);

  if (title && description && difficulty) {
    const response = await fetch(`/api/favors`, {
      method: 'POST',
      body: JSON.stringify({ title, description, difficulty }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create project');
    }
  }
};




const updateButtonHandler = async (event) => {
  event.preventDefault();

  const title = $(event.target).closest('form').find('#favor-title').val();

  const description = $(event.target).closest('form').find('#favor-description').val();

  const difficulty = $(event.target).closest('form').find('#favor-difficulty').val();
  const id = event.target.getAttribute('data-id');

  if (title && description && difficulty) {
    const response = await fetch(`/api/favors/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description, difficulty }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to update favor');
    }
  }

};



const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/favors/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete project');
    }
  }
};



const render_skillsprofile = () => {
  const badgeAreas = $('.badges');
  $.each(badgeAreas, function () {
    const skillList = $(this).data("skills");

    let badge = $(this);
    $.each(skillList, function (index, value) {
      let newBadge = $(' <span class="badge bg-success" />');
      newBadge.text(value);

      $(badge).closest('div').append(newBadge);
    });

  });

}

jQuery(document).ready(function($){
  const tradeArea = $('#trade-history');
  const emptyState = $('<p>' + 'You have no trade history.' + '</p>');
  tradeArea.append(emptyState);
  const user_id = $(tradeArea).data("user");
  $.get("/api/trades").then((data) => {
      const matching = data.reduce(function (newArr, ids) {
         if (ids.buyer_id === user_id || ids.seller_id === user_id) {
            const date = new Date(ids.date_traded);
            const formattedDate = (((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear());
           const title = $('<div class="card-title">' + 'Date of trade: ' +  formattedDate +'</div>');
           const card = $('<div class="card mb-3 p-2 favor-list" style="max-width: 40rem;"/>').append(title);
           const favor = $('<p>'+ 'Your favor "'+ ids.buyer_item + '" was traded for "' + ids.seller_item + '"</p>');
           emptyState.remove();
           const body = $('<div class="card-body"/>').append(favor);
           card.append(body);
           tradeArea.append(card);
         } 
      }, []);
  });

});

$(document).ready(function () {
  render_skillsprofile();
});

document
  .querySelector('.new-favor-form')
  .addEventListener('submit', newFormHandler);

document
  .querySelector('.delete')
  .addEventListener('click', delButtonHandler);

document
  .querySelector('.edit-favor-form')
  .addEventListener('submit', updateButtonHandler);

