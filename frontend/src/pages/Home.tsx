import NavBar from "../components/NavBar";
import styles from "./Home.module.css";

export default function Homepage() {
  return (
    <>
      <NavBar />
      <main className={styles.homepage}>
        <section>
          <h1>
            Home Page
          </h1>
        </section>
      </main>
    </>
  );
}
