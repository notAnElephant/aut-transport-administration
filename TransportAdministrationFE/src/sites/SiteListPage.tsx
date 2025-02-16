import useGetSiteList from './queries/use-get-site-list.ts';
import LoadingSection from '../components/loading-section/LoadingSection.tsx';
import ErrorSection from '../components/error-section/ErrorSection.tsx';
import { Box, Button, Divider, IconButton, List, ListItem, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../Routes.ts';
import { Fragment } from 'react';
import useDeleteSiteItem from './queries/use-delete-site-item.ts';
import DeleteIconButtonWithDialog from '../components/delete-icon-button-with-dialog/DeleteIconButtonWithDialog.tsx';
import useIsAdmin from '../auth/hooks/use-is-admin';

const SiteListPage = () => {
  const isAdmin = useIsAdmin();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isFetching, isError } = useGetSiteList();
  const { mutateAsync: deleteSiteItem, isPending: isDeleteSiteItemPending } = useDeleteSiteItem();

  const handleAddNew = () => {
    navigate(ROUTES.SITE_ITEM('new'));
  };

  const handleEdit = (id: number) => () => {
    navigate(ROUTES.SITE_ITEM(id.toString()));
  };

  const handleDeleteSiteItem = (id: number) => async () => {
    await deleteSiteItem(id.toString());
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
          {data?.map((site, index) => (
            <Fragment key={site.id}>
              {index !== 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={handleEdit(site.id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <DeleteIconButtonWithDialog
                      onDelete={handleDeleteSiteItem(site.id)}
                      dialogTitle={t('sites.confirmDeleteTitle')}
                      dialogDescription={site.address}
                      isLoading={isDeleteSiteItemPending}
                    />
                  </Box>
                }
              >
                {`${site.name} - ${site.address}`}
              </ListItem>
            </Fragment>
          ))}
        </List>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
          <Typography sx={{ textAlign: 'center' }}>{t('sites.noSites')}</Typography>
        </Box>
      )}
    </Box>
  );
};
export default SiteListPage;
