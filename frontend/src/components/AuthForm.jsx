
import React, { useState } from 'react';

export default function AuthForm({
  page,
  setPage,
  email,
  setEmail,
  password,
  setPassword,
  selectedRole,
  setSelectedRole,
  name,
  setName,
  setProfilePic,
  collegeId,
  setCollegeId,
  batch,
  setBatch,
  branch,
  setBranch,
  company,
  setCompany,
  jobTitle,
  setJobTitle,
  experience,
  setExperience,
  message,
  handleAuth
}) {
  const [focusedField, setFocusedField] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfilePic(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const eyes = container.querySelectorAll('.auth-eyeball');

    eyes.forEach((eye) => {
      const eyeRect = eye.getBoundingClientRect();

      const eyeX =
        eyeRect.left -
        rect.left +
        eyeRect.width / 2;

      const eyeY =
        eyeRect.top -
        rect.top +
        eyeRect.height / 2;

      const dx = mouseX - eyeX;
      const dy = mouseY - eyeY;

      const angle = Math.atan2(dy, dx);

      const distance = Math.min(
        7,
        Math.hypot(dx, dy) / 10
      );

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      eye.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  };

  const handleMouseLeave = (e) => {
    const eyes = e.currentTarget.querySelectorAll('.auth-eyeball');

    eyes.forEach((eye) => {
      eye.style.transform = 'translate(0, 0)';
    });
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .auth-page-wrapper {
          min-height: 100vh;
          width: 100%;
          background: #f0f2f5;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .auth-card {
          display: flex;
          background: #ffffff;
          width: 900px;
          min-height: 520px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          position: relative;
        }

        /* =========================
           ILLUSTRATION SIDE
        ========================= */

        .auth-illustration-side {
          flex: 1;
          min-height: 520px;
          background: #f4f4f6;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          position: relative;
          overflow: hidden;
        }

        .auth-illustration-side svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .auth-character-group {
          transition:
            transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        /* =========================
           EMAIL FOCUS
        ========================= */

        .auth-illustration-side.email-focused
        .auth-char-orange {
          transform:
            translate(50px, 170px)
            scaleY(1.05);
        }

        .auth-illustration-side.email-focused
        .auth-char-purple {
          transform:
            translate(170px, 50px);
        }

        /* =========================
           PASSWORD FOCUS
        ========================= */

        .auth-illustration-side.password-focused
        .auth-eyeball {
          transform: translateX(-10px) !important;
        }

        /* =========================
           REGISTER ILLUSTRATION
        ========================= */

        .auth-illustration-side.register-mode
        .auth-char-orange {
          transform: translate(35px, 175px);
        }

        .auth-illustration-side.register-mode
        .auth-char-purple {
          transform: translate(165px, 65px);
        }

        .auth-illustration-side.register-mode
        .auth-char-black {
          transform: translate(265px, 125px);
        }

        .auth-illustration-side.register-mode
        .auth-char-yellow {
          transform: translate(300px, 145px);
        }

        /* =========================
           FORM SIDE
        ========================= */

        .auth-form-side {
          flex: 1;
          padding: 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #ffffff;
          overflow-y: auto;
          max-height: 700px;
        }

        /*
          IMPORTANT:
          Registration has many more fields than Login.
          This class makes ONLY the registration form
          start from the top instead of being vertically
          centered.
        */

        .auth-form-side.register-mode-form {
          justify-content: flex-start;
          padding-top: 35px;
          padding-bottom: 35px;
        }

        .auth-form-side h2 {
          font-size: 24px;
          margin: 0 0 8px;
          color: #111111;
          font-weight: 700;
        }

        .auth-form-side > p {
          color: #777777;
          font-size: 14px;
          margin: 0 0 30px;
        }

        .auth-form {
          width: 100%;
        }

        .auth-input-group {
          margin-bottom: 18px;
          display: flex;
          flex-direction: column;
        }

        .auth-input-group label {
          font-size: 12px;
          font-weight: 600;
          color: #444444;
          margin-bottom: 6px;
        }

        .auth-input-group input,
        .auth-input-group select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #dddddd;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          background: #ffffff;
          color: #222222;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .auth-input-group input:focus,
        .auth-input-group select:focus {
          border-color: #111111;
          box-shadow: 0 0 0 2px rgba(17, 17, 17, 0.05);
        }

        .auth-input-group input::placeholder {
          color: #aaaaaa;
        }

        /* =========================
           PROFILE PICTURE
        ========================= */

        .auth-file-input {
          padding: 9px 12px !important;
          cursor: pointer;
        }

        .auth-file-input::file-selector-button {
          border: none;
          background: #111111;
          color: white;
          padding: 7px 12px;
          border-radius: 6px;
          margin-right: 10px;
          cursor: pointer;
        }

        /* =========================
           MESSAGE
        ========================= */

        .auth-message {
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 18px;
          background: #eef5ff;
          color: #24527a;
          border: 1px solid #d7e7fa;
          font-size: 13px;
        }

        /* =========================
           BUTTON
        ========================= */

        .auth-login-btn {
          width: 100%;
          background: #111111;
          color: #ffffff;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 5px;
          transition:
            background 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .auth-login-btn:hover {
          background: #333333;
          transform: translateY(-1px);
          box-shadow: 0 5px 12px rgba(0, 0, 0, 0.12);
        }

        .auth-login-btn:active {
          transform: translateY(0);
        }

        /* =========================
           LOGIN / REGISTER SWITCH
        ========================= */

        .auth-switch {
          text-align: center;
          margin-top: 18px;
          font-size: 13px;
          color: #777777;
          padding-bottom: 5px;
        }

        .auth-switch button {
          border: none;
          background: transparent;
          color: #111111;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
        }

        .auth-switch button:hover {
          text-decoration: underline;
        }

        /* =========================
           MOBILE
        ========================= */

        @media (max-width: 800px) {

          .auth-page-wrapper {
            padding: 20px;
            align-items: flex-start;
          }

          .auth-card {
            width: 100%;
            max-width: 500px;
            min-height: auto;
            flex-direction: column;
          }

          .auth-illustration-side {
            min-height: 260px;
            height: 260px;
            flex: none;
          }

          .auth-form-side {
            max-height: none;
            padding: 35px 28px;
            overflow: visible;
          }

          /*
            Registration should still begin from the top
            on mobile.
          */

          .auth-form-side.register-mode-form {
            padding-top: 30px;
            padding-bottom: 30px;
          }

          .auth-illustration-side svg {
            width: 100%;
            height: 100%;
          }
        }

        @media (max-width: 480px) {

          .auth-page-wrapper {
            padding: 10px;
          }

          .auth-card {
            border-radius: 15px;
          }

          .auth-illustration-side {
            min-height: 220px;
            height: 220px;
          }

          .auth-form-side {
            padding: 28px 20px;
          }

          .auth-form-side.register-mode-form {
            padding: 28px 20px;
          }

          .auth-form-side h2 {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="auth-page-wrapper">

        <div className="auth-card">

          {/* =========================
              ILLUSTRATION
          ========================= */}

          <div
            className={`
              auth-illustration-side
              ${focusedField === 'email' ? 'email-focused' : ''}
              ${focusedField === 'password' ? 'password-focused' : ''}
              ${page === 'register' ? 'register-mode' : ''}
            `}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >

            <svg
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >

              {/* =========================
                  ORANGE CHARACTER
              ========================= */}

              <g
                className="auth-character-group auth-char-orange"
                transform="translate(50, 180)"
              >

                <path
                  d="M 0 150 Q 0 40, 100 40 Q 200 40, 200 150 Z"
                  fill="#ff7a30"
                />

                <circle
                  className="auth-eyeball"
                  cx="70"
                  cy="90"
                  r="6"
                  fill="#111"
                />

                <circle
                  className="auth-eyeball"
                  cx="110"
                  cy="90"
                  r="6"
                  fill="#111"
                />

              </g>

              {/* =========================
                  PURPLE CHARACTER
              ========================= */}

              <g
                className="auth-character-group auth-char-purple"
                transform="translate(170, 80)"
              >

                <path
                  d="M 10 250 L 10 60 L 120 20 L 120 250 Z"
                  fill="#7b2cbf"
                />

                <circle
                  className="auth-eyeball"
                  cx="45"
                  cy="80"
                  r="5"
                  fill="#fff"
                />

                <circle
                  className="auth-eyeball"
                  cx="85"
                  cy="70"
                  r="5"
                  fill="#fff"
                />

              </g>

              {/* =========================
                  BLACK CHARACTER
              ========================= */}

              <g
                className="auth-character-group auth-char-black"
                transform="translate(260, 130)"
              >

                <rect
                  x="0"
                  y="0"
                  width="70"
                  height="200"
                  fill="#1d1d1b"
                />

                <circle
                  className="auth-eyeball"
                  cx="25"
                  cy="50"
                  r="4"
                  fill="#fff"
                />

                <circle
                  className="auth-eyeball"
                  cx="50"
                  cy="50"
                  r="4"
                  fill="#fff"
                />

              </g>

              {/* =========================
                  YELLOW CHARACTER
              ========================= */}

              <g
                className="auth-character-group auth-char-yellow"
                transform="translate(300, 150)"
              >

                <path
                  d="M 0 180 L 0 50 Q 0 0, 50 0 Q 100 0, 100 50 L 100 180 Z"
                  fill="#ffcc00"
                />

                <circle
                  className="auth-eyeball"
                  cx="35"
                  cy="60"
                  r="5"
                  fill="#111"
                />

                <circle
                  className="auth-eyeball"
                  cx="70"
                  cy="60"
                  r="5"
                  fill="#111"
                />

              </g>

            </svg>

          </div>

          {/* =========================
              FORM SIDE
          ========================= */}

          <div
            className={`
              auth-form-side
              ${page === 'register' ? 'register-mode-form' : ''}
            `}
          >

            <h2>
              {page === 'register'
                ? 'Create an account'
                : 'Welcome back!'}
            </h2>

            <p>
              {page === 'register'
                ? 'Create your account and start connecting.'
                : 'Please enter your details to sign in.'}
            </p>

            {message && (
              <div className="auth-message">
                {message}
              </div>
            )}

            <form
              className="auth-form"
              onSubmit={handleAuth}
            >

              {/* =========================
                  REGISTER ONLY
              ========================= */}

              {page === 'register' && (
                <>

                  {/* FULL NAME */}

                  <div className="auth-input-group">

                    <label htmlFor="auth-name">
                      Full Name
                    </label>

                    <input
                      id="auth-name"
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                      placeholder="Enter your full name"
                    />

                  </div>

                  {/* PROFILE PICTURE */}

                  <div className="auth-input-group">

                    <label htmlFor="auth-profile-pic">
                      Profile Picture (Optional)
                    </label>

                    <input
                      id="auth-profile-pic"
                      type="file"
                      className="auth-file-input"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                  </div>

                </>
              )}

              {/* =========================
                  EMAIL
              ========================= */}

              <div className="auth-input-group">

                <label htmlFor="auth-email">
                  Email
                </label>

                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  onFocus={() =>
                    setFocusedField('email')
                  }
                  required
                  placeholder="anna@gmail.com"
                  autoComplete="off"
                />

              </div>

              {/* =========================
                  PASSWORD
              ========================= */}

              <div className="auth-input-group">

                <label htmlFor="auth-password">
                  Password
                </label>

                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onFocus={() =>
                    setFocusedField('password')
                  }
                  required
                  placeholder="password"
                />

              </div>

              {/* =========================
                  REGISTER FIELDS
              ========================= */}

              {page === 'register' && (
                <>

                  {/* ROLE */}

                  <div className="auth-input-group">

                    <label htmlFor="auth-role">
                      Role
                    </label>

                    <select
                      id="auth-role"
                      value={selectedRole}
                      onChange={(e) =>
                        setSelectedRole(e.target.value)
                      }
                    >

                      <option value="Student">
                        Student
                      </option>

                      <option value="Alumni">
                        Alumni
                      </option>

                    </select>

                  </div>

                  {/* =========================
                      STUDENT FIELDS
                  ========================= */}

                  {selectedRole === 'Student' ? (
                    <>

                      <div className="auth-input-group">

                        <label htmlFor="auth-college-id">
                          College ID Number
                        </label>

                        <input
                          id="auth-college-id"
                          type="text"
                          value={collegeId}
                          onChange={(e) =>
                            setCollegeId(e.target.value)
                          }
                          required
                          placeholder="Enter college ID"
                        />

                      </div>

                      <div className="auth-input-group">

                        <label htmlFor="auth-batch">
                          Batch / Graduation Year
                        </label>

                        <input
                          id="auth-batch"
                          type="text"
                          value={batch}
                          onChange={(e) =>
                            setBatch(e.target.value)
                          }
                          required
                          placeholder="e.g. 2027"
                        />

                      </div>

                      <div className="auth-input-group">

                        <label htmlFor="auth-branch">
                          Branch / Major
                        </label>

                        <input
                          id="auth-branch"
                          type="text"
                          value={branch}
                          onChange={(e) =>
                            setBranch(e.target.value)
                          }
                          required
                          placeholder="e.g. MCA"
                        />

                      </div>

                    </>
                  ) : (

                    /* =========================
                       ALUMNI FIELDS
                    ========================= */

                    <>

                      <div className="auth-input-group">

                        <label htmlFor="auth-company">
                          Current Company
                        </label>

                        <input
                          id="auth-company"
                          type="text"
                          value={company}
                          onChange={(e) =>
                            setCompany(e.target.value)
                          }
                          required
                          placeholder="e.g. Google"
                        />

                      </div>

                      <div className="auth-input-group">

                        <label htmlFor="auth-job-title">
                          Job Title / Role
                        </label>

                        <input
                          id="auth-job-title"
                          type="text"
                          value={jobTitle}
                          onChange={(e) =>
                            setJobTitle(e.target.value)
                          }
                          required
                          placeholder="e.g. Software Engineer"
                        />

                      </div>

                      <div className="auth-input-group">

                        <label htmlFor="auth-experience">
                          Years of Experience
                        </label>

                        <input
                          id="auth-experience"
                          type="text"
                          value={experience}
                          onChange={(e) =>
                            setExperience(e.target.value)
                          }
                          required
                          placeholder="e.g. 3"
                        />

                      </div>

                    </>
                  )}

                </>
              )}

              {/* =========================
                  SUBMIT BUTTON
              ========================= */}

              <button
                type="submit"
                className="auth-login-btn"
              >
                {page === 'register'
                  ? 'Create Account'
                  : 'Log In'}
              </button>

            </form>

            {/* =========================
                PAGE SWITCH
            ========================= */}

            <div className="auth-switch">

              {page === 'register' ? (
                <>
                  Already have an account?

                  <button
                    type="button"
                    onClick={() => setPage('login')}
                  >
                    Log In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?

                  <button
                    type="button"
                    onClick={() => setPage('register')}
                  >
                    Create Account
                  </button>
                </>
              )}

            </div>

          </div>

        </div>

      </div>
    </>
  );
}


