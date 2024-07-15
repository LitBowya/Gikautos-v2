import { useSelector } from "react-redux";
import { Grid, Header, Icon } from "semantic-ui-react";
import "./UserInfo.css";

const UserInfo = () => {
    const { userInfo } = useSelector((state) => state.auth);

  return (
    <Grid>
      <Grid.Column>
        <Grid.Row className="userinfo_grid_row">
          <Header inverted as="h4" className="d-flex justify-content-between">
            <div>
              <Icon name="slack" />
              <Header.Content>gikautos</Header.Content>
            </div>
                      <span>{userInfo.username}</span>
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  );
};

export default UserInfo;
