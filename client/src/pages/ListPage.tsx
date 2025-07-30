import { Grid } from "@mui/material";
import AnimalCard from "../components/AnimalCard";
import { Animal } from "../interfaces/Animal";
import { useEffect, useState } from "react";
import '../style/ListPage.css';
import { Plant } from "../interfaces/Plant";
import PlantCard from "../components/PlantCard";
import { InhabitantType } from "../interfaces/InhabitantType";
import { InhabitantRepository } from "../repositories/InhabitantRepository";

const ListPage: React.FC = () => {
  const [inhabitants, setInhabitants] = useState<(Animal | Plant)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInhabitants = async () => {
      try {
        const repository = InhabitantRepository.getInstance();
        const data = await repository.getAllInhabitants();
        setInhabitants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    fetchInhabitants();
  }, []);

  if (loading) return <div>Lädt...</div>;
  if (error) return <div>Fehler: {error}</div>;

  return (
    <div>
      <Grid container spacing={1}>
        {inhabitants.map((inhabitant, index) => (
          inhabitant.type === InhabitantType.FISH || inhabitant.type === InhabitantType.INVERTEBRATE ? (
            <AnimalCard key={index} animal={inhabitant as Animal} isPredatorConflict={false} />
          ) : (
            <PlantCard key={index} plant={inhabitant as Plant} />
          )
        ))}
      </Grid>
    </div>
  );
};

export default ListPage;	