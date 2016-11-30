$(document).ready(function() {
  $('#add-new').click(function() {
    let lastIndex = $('#investments tr:last').index();
    $('#investments tr:last').after(getRowScope(lastIndex+1))
  });
});

function deleteAction(elem) {
  let id = elem.id.split('-')[1];
  $(`#row-${id}`).remove();
}

function getRowScope(index) {
  return `
  <tr id="row-${index}">
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
