//=== SIGN UP FROM ============================================================
// show socials form if the user account type is tailor
// show measurements form if the user account type is client
function initializeSignUp() {
  update($("#usertype").val());

  $("#usertype").change(({ target: { value } }) => update(value));

  function update(value) {
    if (!(value == "client" || value === "tailor")) {
      $("#default-form").fadeIn(0);
      $("#default-form").fadeIn(0);
      $("#socials-form").fadeOut(0);
      $("#measurements-form").fadeOut(0);
      return;
    }

    $("#default-form").fadeOut(0);

    if (value === "client") {
      $("#measurements-form").fadeIn(0);

      $("#default-form").fadeOut(0);
      $("#socials-form").fadeOut(0);
    }

    if (value === "tailor") {
      $("#socials-form").fadeIn(0);

      $("#default-form").fadeOut(0);
      $("#measurements-form").fadeOut(0);
    }
  }
}

initializeSignUp();
//=============================================================================

//=== VALIDATION ERROR MODAL =======================================================
htmx.onLoad(() => {
  $("#signup-error #close-btn").click((event) => {
    $("#form-validation-modal").fadeOut(300, (event) => {
      $("#form-validation-modal").html("");
    });
  });
});
//=============================================================================

htmx.onLoad(() => {
  $("#accept-request-modal").fadeOut(0);
  $("#accept-request-btn").click((event) => {
    $("#accept-request-modal").fadeIn(300, () => {
      $("body").on("click.foo", (event) => {
        if (event.target.closest("#accept-request-container") === null) {
          $("#accept-request-modal").fadeOut(400);
          $("body").off("click.foo");
        }
      });
    });
  });
});
