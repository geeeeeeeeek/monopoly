"use strict";

window.onload = () => {
    const profileEditButton = document.getElementById("profile-edit");
    const profileUpdateButton = document.getElementById("profile-update");
    const profileBioTextarea = document.getElementById("profile-bio");
    const profileAvatarUpload = document.getElementById("profile-avatar-edit-mask");
    const profileAvatarFileInput = document.getElementById("profile-avatar-file");

    profileEditButton.addEventListener("click", () => {
        profileUpdateButton.removeAttribute("hidden");
        profileEditButton.setAttribute("hidden", true);
        profileBioTextarea.removeAttribute("readOnly");
        profileBioTextarea.classList.add("editing");
        profileAvatar.classList.add("avatar-editing-box");
    });

    profileUpdateButton.addEventListener("click", e => {
        if (!profileAvatarFileInput.value && !document.getElementById('profile-user-avatar').getAttribute("src").length) {
            alert("Profile photo can't be empty!");
            window.location.reload();
            e.preventDefault();
        }

        profileEditButton.removeAttribute("hidden");
        profileUpdateButton.setAttribute("hidden", true);
        profileBioTextarea.readOnly = "true";
        profileBioTextarea.classList.remove("editing");
        profileAvatar.classList.remove("avatar-editing-box");
    });

    const profileAvatar = document.getElementById("profile-user-avatar");
    const profileAvatarMask = document.getElementById("profile-avatar-edit-mask");
    profileAvatar.addEventListener("mouseenter", () => {
        profileAvatarMask.classList.add("avatar-editing");
    });

    profileAvatarMask.addEventListener("mouseenter", () => {
        profileAvatarMask.classList.add("avatar-editing");
    });

    profileAvatar.addEventListener("mouseleave", () => {
        profileAvatarMask.classList.remove("avatar-editing");
    });

    profileAvatarUpload.addEventListener("click", () => {
        profileEditButton.click();
        profileAvatarFileInput.click();
        profileUpdateButton.removeAttribute("hidden");
    })
};