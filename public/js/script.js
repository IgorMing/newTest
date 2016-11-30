$(document).ready(function() {
  $('#add-new').click(function() {
    const rowLength = $('#investments tbody tr').length;

    if (rowLength === 0) {
      $('#investments tbody').append(getRowScope(1));
      return;
    }

    const lastIndex = $('#investments tbody tr:last').attr('id').split('-')[1];

    $('#investments tbody tr:last').after(getRowScope(Number(lastIndex)+1));
  });
});

function selectedRow(elem) {
  $('#investments tr').removeClass('active')
  $(`#${elem.id}`).addClass('active');
}

function deleteAction(elem) {
  let id = elem.id.split('-')[1];
  $(`#row-${id}`).remove();
}

function getRowScope(index) {
  return `
  <tr id="row-${index}" onClick="selectedRow(this);">
    <td>
      <img src="images/aplicacao.png" alt="">
    </td>
    <td>
      <input class="form-control" type="date">
    </td>
    <td class="form-group">
      <select class="form-control">
        <option value="aplicacao">Aplicação</option>
        <option value="resgate">Resgate</option>
        <option value="resgateir">Resgate para IR</option>
      </select>
    </td>
    <td>
      <input class="form-control" type="text">
    </td>
    <td>
      <input class="form-control" type="text" disabled>
    </td>
    <td>
      <input class="form-control" type="text" disabled>
    </td>
    <td>
      <img id="img-${index}" onClick="deleteAction(this);" src="images/delete.png" alt="" />
    </td>
  </tr>
  `;
}
