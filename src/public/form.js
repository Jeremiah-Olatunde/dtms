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
