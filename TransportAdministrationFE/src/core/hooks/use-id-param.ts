import { useParams } from 'react-router-dom';

const useIdParam = () => {
  const { id } = useParams();

  return id ?? null;
};

export default useIdParam;
