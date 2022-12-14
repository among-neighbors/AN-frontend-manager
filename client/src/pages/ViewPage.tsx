import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import TableNav from '~/components/molecules/TableNav';
import Board from '~/components/organisms/Board';
import Comment from '~/components/organisms/Comment';
import PageHeader from '~/components/organisms/PageHeader';
import { useLocation } from 'react-router-dom';
import myAxios from '~/others/myAxios';
import {
  isDeliveredCommunityPostData,
  isDeliveredNoticePostData,
  DeliverdTypePostData,
  ProcessedTypePostData,
  Obj,
} from '~/others/integrateInterface';
import { connect } from 'react-redux';
import { accessTokenState, RootState } from '~/others/store';
import { MANAGER_HOUSENAME } from '~/others/integrateVariable';

interface ViewPageProps {
  type: string;
  accessToken: accessTokenState;
  isReadyForRequestAPI: boolean;
}

const ViewPage = ({ type, accessToken, isReadyForRequestAPI }: ViewPageProps) => {
  const [writerId, setWriterId] = useState<number>();
  const [viewData, setViewData] = useState<DeliverdTypePostData | null>(null);
  const [boardData, setBoardData] = useState<ProcessedTypePostData | null>(null);
  const location = useLocation();

  const getViewData = async (id: string) => {
    const res = await myAxios(
      'get',
      `${APIbyTypeForView[type]}/${id}`,
      null,
      true,
      accessToken.accountAccessToken,
    );
    setViewData(res.data.response);
  };

  useEffect(() => {
    if (!isReadyForRequestAPI) return;
    const id = location.pathname.split('/')[2];
    getViewData(id);
  }, [isReadyForRequestAPI]);

  useEffect(() => {
    if (!viewData) return;
    const commonViewData = {
      id: viewData.id,
      title: viewData.title,
      content: viewData.content,
      date: viewData.createdDate,
    };
    setWriterId(viewData.writer.id);
    if (isDeliveredNoticePostData(viewData)) {
      const { writer, scope } = viewData;
      setBoardData({
        ...commonViewData,
        writer: writer.name,
        scope,
      });
      return;
    }

    if (isDeliveredCommunityPostData(viewData)) {
      const { writer, scope, category } = viewData;
      setBoardData({
        ...commonViewData,
        writer: `${
          writer.houseName === MANAGER_HOUSENAME ? `` : `${writer.lineName} ${writer.houseName} `
        }${writer.name}`,
        scope,
        category,
      });
      return;
    }

    const { writer } = viewData;
    setBoardData({
      ...commonViewData,
      writer: `${writer.lineName} ${writer.houseName}`,
    });
  }, [viewData]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <PageHeader type={type} />
      {type === 'community' || type === 'notice' ? <TableNav type={type} /> : <></>}
      {boardData && writerId && <Board type={type} boardData={boardData} writerId={writerId} />}
      {boardData && (type === 'community' || type === 'complaint') ? (
        <Comment type={type} boardId={boardData.id} accessToken={accessToken} />
      ) : (
        <></>
      )}
    </Box>
  );
};

const APIbyTypeForView: Obj<string> = {
  notice: `api/v1/notices`,
  complaint: `api/v1/reports`,
  community: `api/v1/communities`,
};

const mapStateToProps = (state: RootState) => {
  return {
    accessToken: state.accessTokenReducer,
    isReadyForRequestAPI: state.readyForRequestAPIReducer,
  };
};

export default connect(mapStateToProps)(ViewPage);
