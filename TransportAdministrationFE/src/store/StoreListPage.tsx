import useGetStoreList from './queries/use-get-store-list.ts';
import LoadingSection from '../components/loading-section/LoadingSection.tsx';
import ErrorSection from '../components/error-section/ErrorSection.tsx';
import { Box, List, ListItem, Button, Typography, Divider, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../Routes.ts';
import { Fragment } from 'react';
import useDeleteStoreItem from './queries/use-delete-store-item.ts';
import DeleteIconButtonWithDialog from '../components/delete-icon-button-with-dialog/DeleteIconButtonWithDialog.tsx';
import useIsAdmin from '../auth/hooks/use-is-admin';

const StoreListPage = () => {
  const { t } = useTranslation();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const { data, isFetching, isError } = useGetStoreList();
  const { mutateAsync: deleteStoreItem, isPending: isDeleteStoreItemPending } = useDeleteStoreItem();

  const handleAddNew = () => {
    navigate(ROUTES.STORE_ITEM('new'));
  };

  const handleEdit = (id: number) => () => {
    navigate(ROUTES.STORE_ITEM(id.toString()));
  };

  const handleDeleteStoreItem = (id: number) => async () => {
    await deleteStoreItem(id.toString());
  };

  if (isFetching) {
    return <LoadingSection />;
  }

  if (isError) {
    return <ErrorSection />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {isAdmin && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
          <Button variant="contained" onClick={handleAddNew}>
            {t('addNew')}
          </Button>
        </Box>
      )}
      {data?.length ? (
        <List>
          {data.map((store, index) => (
            <Fragment key={store.id}>
              {index !== 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={handleEdit(store.id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <DeleteIconButtonWithDialog
                      onDelete={handleDeleteStoreItem(store.id)}
                      dialogTitle={t('stores.confirmDeleteTitle')}
                      dialogDescription={store.address}
                      isLoading={isDeleteStoreItemPending}
                    />
                  </Box>
                }
              >
                {store.address}
              </ListItem>
            </Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
          <Typography sx={{ textAlign: 'center' }}>{t('stores.noStores')}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default StoreListPage;
