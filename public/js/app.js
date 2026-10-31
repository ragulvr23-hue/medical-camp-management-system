$(function () {
  // Client-side validation using Bootstrap's validation styles.
  $(".needs-validation").on("submit", function (event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    $(this).addClass("was-validated");
  });
  $(".confirm-delete").on("submit", function (event) {
    if (!window.confirm("Delete this student and associated demo records? This cannot be undone.")) event.preventDefault();
  });
  // Attach CSRF token to same-origin AJAX requests.
  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (!/^(GET|HEAD|OPTIONS)$/i.test(settings.type)) {
        xhr.setRequestHeader("CSRF-Token", $('meta[name="csrf-token"]').attr("content"));
      }
    }
  });
});