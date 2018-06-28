import React, { Component } from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { green50 } from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
const styles = {
	label: {
		color: green50
	},

	unitSelectField: {
		marginLeft: '24px'
	}
};
class Navbar extends Component {
	constructor() {
		super();
		this.state = {
			openInfoDialog: false,
			openContactDialog: false,
			openMapDialog: false
		};
	}
	handleInfoOpen = () => {
		this.setState({ openInfoDialog: true });
	};

	handleInfoClose = () => {
		this.setState({ openInfoDialog: false });
	};

	handleContactOpen = () => {
		this.setState({ openContactDialog: true });
	};

	handleContactClose = () => {
		this.setState({ openContactDialog: false });
	};

	handleMapOpen = () => {
		this.setState({ openMapDialog: true });
	};

	handleMapClose = () => {
		this.setState({ openMapDialog: false });
	};
	render() {
		const mapActions = [<FlatButton label="Finish" onClick={this.handleMapClose} />];
		const infoActions = [<FlatButton label="Ok" onClick={this.handleInfoClose} />];
		const contactActions = [<FlatButton label="Ok" onClick={this.handleContactClose} />];

		return (
			<div>
				<Toolbar>
					<ToolbarGroup firstChild>
						<FontIcon className="material-icons" onClick={this.props.toggleDrawer}>
							menu
						</FontIcon>
						<img alt="GreenNav" src="/images/nav-e.png" style={{ height: '50px', paddingLeft: '10px' }} />
					</ToolbarGroup>

					<ToolbarGroup>
						<ToolbarTitle text="Map Options" />
						<FontIcon className="material-icons" onClick={this.handleMapOpen}>
							map
						</FontIcon>
						<ToolbarSeparator />
						<FlatButton
							label="Info"
							labelStyle={styles.label}
							onClick={this.handleInfoOpen}
							icon={
								<FontIcon className="material-icons" color={green50}>
									info
								</FontIcon>
							}
						/>
						<FlatButton
							label="Contact"
							labelStyle={styles.label}
							onClick={this.handleContactOpen}
							icon={
								<FontIcon className="material-icons" color={green50}>
									email
								</FontIcon>
							}
						/>
					</ToolbarGroup>
				</Toolbar>

				<Dialog
					title=""
					actions={infoActions}
					modal={false}
					open={this.state.openInfoDialog}
					onRequestClose={this.handleInfoClose}
				>
					<h2>Nav-e</h2>
					<p>
						The nav-e organization is a community of young researchers and students at the University of
						Lübeck.We decided not long ago to go open source in order to collaborate with others and to show
						what we are working on.
					</p>
					<p>
						The projects of the nav-e organization are closely related to the student projects at the
						university’s computer science program. However, with this organisation we invite everyone to
						participate in the development of experimental routing systems.
						<br />
						<a href="http://nav-e.github.io/" rel="noopener noreferrer" target="_blank">
							Get more information about Nav-e
						</a>
					</p>
				</Dialog>

				<Dialog
					title=""
					actions={contactActions}
					modal={false}
					open={this.state.openContactDialog}
					onRequestClose={this.handleContactClose}
				>
					<h2>Contact</h2>
					<p>
						There are several ways to contact us. For questions about coding, issues, etc. please use{' '}
						<a href="https://github.com/nav-e" rel="noopener noreferrer" target="_blank">
							Github
						</a>
					</p>
					<p>
						For more general questions use our{' '}
						<a
							href="https://plus.google.com/communities/110704433153909631379"
							rel="noopener noreferrer"
							target="_blank"
						>
							G+ page
						</a>{' '}
						or{' '}
						<a
							href="https://groups.google.com/forum/#!forum/greennav"
							rel="noopener noreferrer"
							target="_blank"
						>
							Google Groups
						</a>
					</p>
				</Dialog>

				<Dialog
					title="Map Settings"
					actions={mapActions}
					modal={false}
					open={this.state.openMapDialog}
					onRequestClose={this.handleMapClose}
				>
					<SelectField
						floatingLabelText="Map Type"
						value={this.props.mapType}
						onChange={this.props.mapTypeChange}
					>
						<MenuItem value={0} primaryText="OpenStreetMap" />
						<MenuItem value={1} primaryText="Google Map" />
					</SelectField>
					<SelectField
						floatingLabelText="Units"
						value={this.props.unitsType}
						style={styles.unitSelectField}
						onChange={this.props.unitsTypeChange}
					>
						<MenuItem value={0} primaryText="Kilometers" />
						<MenuItem value={1} primaryText="Miles" />
					</SelectField>
					<h2>Overlays</h2>
					<Toggle
						label="Traffic"
						toggled={this.props.trafficEnabled}
						onToggle={this.props.toggleTraffic}
						labelPosition="right"
						thumbSwitchedStyle={styles.thumbSwitched}
						trackSwitchedStyle={styles.trackSwitched}
					/>
					<Toggle
						label="Temperature"
						toggled={this.props.temperatureEnabled}
						onToggle={this.props.toggleTemperature}
						labelPosition="right"
						thumbSwitchedStyle={styles.thumbSwitched}
						trackSwitchedStyle={styles.trackSwitched}
					/>
					<Toggle
						label="Wind"
						toggled={this.props.windEnabled}
						onToggle={this.props.toggleWind}
						labelPosition="right"
						thumbSwitchedStyle={styles.thumbSwitched}
						trackSwitchedStyle={styles.trackSwitched}
					/>
				</Dialog>
			</div>
		);
	}
}

export default Navbar;
Navbar.propTypes = {
	mapType: PropTypes.number,
	unitsType: PropTypes.number,
	trafficEnabled: PropTypes.bool,
	temperatureEnabled: PropTypes.bool,
	windEnabled: PropTypes.bool,
	mapTypeChange: PropTypes.func.isRequired,
	toggleTraffic: PropTypes.func.isRequired,
	toggleWind: PropTypes.func.isRequired,
	toggleTemperature: PropTypes.func.isRequired,
	toggleDrawer: PropTypes.func.isRequired,
	unitsTypeChange: PropTypes.func.isRequired
};

Navbar.defaultProps = {
	mapType: 0,
	unitsType: 0,
	temperatureEnabled: false,
	trafficEnabled: false,
	windEnabled: false
};
