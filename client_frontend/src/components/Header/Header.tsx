import React from "react";
import { Button } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const picture = useSelector((state: RootState) => state.auth.user?.picture);
  const navigate = useNavigate();

  const isLoggedIn = !!token;

  const signOut = () => {
    dispatch(clearAuth());
    navigate("/", { replace: true });
  };

  return (
    <header className="mt-3 mb-3">
      <nav
        className="navbar navbar-expand-lg bg-transparent"
        data-bs-theme="light"
      >
        <div className="container-fluid">
          {isLoggedIn && (
            <Link className="navbar-brand" to="/">
              Домашня сторінка
            </Link>
          )}

          <div className="collapse navbar-collapse" id="navbarColor03">
            {isLoggedIn ? (
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="petitions">
                    <i className="bi bi-card-checklist"></i> Петиції
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="analytics">
                    <i className="bi bi-bar-chart"></i> Аналітика
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about">
                    <i className="bi bi-person"></i> Про Нас
                  </NavLink>
                </li>
              </ul>
            ) : (
              <div className="me-auto"></div>
            )}
            {isLoggedIn ? (
              <>
                <span className="navbar-text me-3 fw-bold">
                  {email}
                </span>
                {picture && (
                  <img
                    src={picture}
                    alt="user"
                    className="rounded-circle"
                    style={{ width: "40px", height: "40px" }}
                  />
                )}
                <Button variant="primary" className="ms-3" onClick={signOut}>
                  Вихід
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-decoration-none text-reset">
                  <Button variant="primary" className="ms-3">
                    Вхід
                  </Button>
                </Link>
                <Link
                  to="/register"
                  className="text-decoration-none text-reset"
                >
                  <Button variant="outline-primary" className="ms-3">
                    Реєстрація
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
