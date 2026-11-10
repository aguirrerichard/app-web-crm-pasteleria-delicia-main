import ProductoCard from '../components/ProductoCard.jsx';
import { useProductos } from '../hooks/useProductos.js';

export default function CatalogoPage() {
  const { productos, cargando, error } = useProductos();

  return (
    <>
      <section className="portada">
        <h1>Encarga tu torta para mañana o cuando la necesites</h1>
        <p>Elige tu favorita, déjanos tu dedicatoria y sigue tu pedido en línea con tu código.</p>
      </section>

      {cargando && <p className="aviso">Cargando tortas…</p>}
      {error && <p className="aviso error" role="alert">{error}</p>}

      <section className="rejilla">
        {productos.map((p, i) => <ProductoCard key={p.id} producto={p} indice={i} />)}
      </section>
    </>
  );
}