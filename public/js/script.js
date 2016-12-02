const BASE_URL = 'https://magnetis-trades.herokuapp.com';

$(document).ready(function() {

  $('#add-new').click(function(e) {
    e.preventDefault();
    addNew(null, true);
  });

  $('#form-investments').submit(function(e) {
    e.preventDefault();

    $('#form-investments tr').each(function(i, v) {
      console.log(i, v);
    })
  })

  fetchInvestments();
});

function getPrice(date, fund_id, success) {
  // if (typeof(date) === 'object'){
  //   console.log(date);
  // }

  let splittedDate = date.split('/');
  if (splittedDate.length === 3) {
    date = `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
  }

  return $.ajax({
    method: 'GET',
    dataType: 'json',
    url: `${BASE_URL}/funds/${fund_id}/prices.json?date=${date}`,
    success
  })
}

function fetchInvestments() {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: `${BASE_URL}/trades.json`,
    success: function(tradesResponse) {
      $.each(tradesResponse, function(i, trade) {
        const { date, fund_id, kind, shares } = trade;

        getPrice(date, fund_id, function(pricesResponse) {
          const investmentObj = {
            date,
            kind,
            shares,
            price: pricesResponse.price,
          };

          addNew(investmentObj, false);
        });
      });
    }
  });
}

function addNew(elem, isNew) {
  const rowLength = $('#investments tbody tr').length;
  let indexToAdd = 0;

  if (rowLength === 0) {
    indexToAdd = 1
    $('#investments tbody').append(getRowScope(indexToAdd, elem, isNew));
  } else {
    indexToAdd = Number($('#investments tbody tr:last').attr('id'))+1;
    $('#investments tbody tr:last').after(getRowScope(indexToAdd, elem, isNew));
  }

  /*
    Set after html rendering
  */
  let date = new Date();

  if (!isNew) {
    date = new Date(elem.date);
  }

  date.setDate(date.getDate()+1);

  const datePicker = $(`#${indexToAdd} .date`);
  datePicker.datepicker($.datepicker.regional['pt-BR']);
  datePicker.datepicker('setDate', date);

  $(datePicker).change(function(e){
    getPrice(e.target.value, 1, function(response) {
      if (!response) {
        alert('Não há cotas para esta data.');
        return;
      }

      console.log(response.price);
      $(`#${indexToAdd} .price`).val(response.price )
    })
  })

}

function selectedRow(elem) {
  $('#investments tr').removeClass('active')
  $(`#${elem.id}`).addClass('active');
}

function deleteAction(elem) {
  const id = elem.id.split('-')[1];
  $(`#${id}`).remove();
}

function calculate(shares, price) {
  return getCurrency(shares * price) || 0;
}

function calcKeyup(elem) {
  const rowId = $(elem).closest('tr').attr('id');
  const price = $(`#price-${rowId}`).val();

  $(`#total-${rowId}`).val(calculate(elem.value, price));
}

function getCurrency(value) {
  return Number(value).toLocaleString('pt-BR') || 0;
}

function getRowScope(index, elem, isNew) {
  const {
    date,
    kind,
    price,
    shares,
  } = elem || {};

  return `
  <tr id=${index} isNew=${isNew} onClick="selectedRow(this);">
    <td>
      <img src="images/${getImage(kind)}" alt="">
    </td>
    <td>
      <input class="form-control date">
    </td>
    <td class="form-group">
      <select class="form-control">
        <option value="0">Aplicação</option>
        <option value="1">Resgate</option>
        <option value="2">Resgate para IR</option>
      </select>
    </td>
    <td>
      <input class="form-control" onkeyup="calcKeyup(this, ${price});" type="number" value=${shares || 0}>
    </td>
    <td>
      <input id="price-${index}" class="form-control price" type="text" value=${price} disabled>
    </td>
    <td>
      <input id="total-${index}" class="form-control" type="text" value=${calculate(shares, price)} disabled>
    </td>
    <td>
      <img id="img-${index}" onClick="deleteAction(this);" src="images/delete.png" alt="" />
    </td>
  </tr>
  `;
}

function getImage(kind) {
  switch(kind) {
    case 0:
    default: {
      return 'aplicacao.png';
    }
    case 1: {
      return 'resgate.png';
    }
    case 2: {
      return 'resgate_ir.png';
    }
  }
}
