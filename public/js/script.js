$(document).ready(function() {

  $('#add-new').click(function(e) {
    e.preventDefault();
    addNew();
  });

  fetchInvestments();
});

function fetchInvestments() {
  const BASE_URL = 'https://magnetis-trades.herokuapp.com';

  $.ajax({
    method: 'GET',
    dataType: 'json',
    url: `${BASE_URL}/trades.json`,
    success: function(tradesResponse) {
      $.each(tradesResponse, function(i, trade) {
        const { date, fund_id, kind, shares } = trade;

        $.ajax({
          method: 'GET',
          dataType: 'json',
          url: `${BASE_URL}/funds/${fund_id}/prices.json?date=${date}`,
          success: function(pricesResponse) {
            const investmentObj = {
              date,
              kind,
              shares,
              price: pricesResponse.price,
            };

            addNew(investmentObj);
          }
        })
      })
    }
  });
}

function addNew(elem) {
  const rowLength = $('#investments tbody tr').length;
  let indexToAdd = 0;

  if (rowLength === 0) {
    indexToAdd = 1
    $('#investments tbody').append(getRowScope(indexToAdd, elem));
  } else {
    indexToAdd = Number($('#investments tbody tr:last').attr('id'))+1;
    $('#investments tbody tr:last').after(getRowScope(indexToAdd, elem));
  }

  /*
    Set after html rendering
  */
  let date = new Date(elem.date);
  date.setDate(date.getDate()+1);

  const datePicker = $(`#${indexToAdd} .date`);
  datePicker.datepicker($.datepicker.regional['pt-BR']);
  datePicker.datepicker('setDate', date);
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
  return shares * price || 0;
}

function calcKeyup(elem, price) {
  const rowId = $(elem).closest('tr').attr('id');

  $(`#total-${rowId}`).val(calculate(elem.value, price));
}

function getRowScope(index, elem) {
  const {
    date,
    kind,
    price,
    shares,
  } = elem || {};
console.log(elem);
  return `
  <tr id=${index} onClick="selectedRow(this);">
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
      <input class="form-control" onkeyup="calcKeyup(this, ${price || 0});" type="text" value=${shares || 0}>
    </td>
    <td>
      <input class="form-control" type="text" value=${price || 0} disabled>
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
    case 0: {
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
