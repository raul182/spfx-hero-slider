import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  Version,
  Environment,
  EnvironmentType,
} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  PropertyPaneToggle,
} from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  PropertyPaneSlider,
} from '@microsoft/sp-property-pane';

import * as strings from 'HeroSliderWebPartStrings';
import HeroSlider from './components/HeroSlider/HeroSlider';
import { HeroSliderProps } from './components/HeroSlider/HeroSliderProps';
import MockDataProvider from './data/MockDataProvider';
import SPRestData from './data/RestDataProvider';
import { DataProvider } from './models/DataProvider';

export default class HeroSliderWebPart extends BaseClientSideWebPart<
  HeroSliderProps
> {
  private getDataProvider(): DataProvider {
    if (DEBUG && Environment.type === EnvironmentType.Local) {
      return new MockDataProvider();
    }

    return new SPRestData(this.context);
  }

  public render(): void {
    const { hideControls, hideNavigation, slidesLimit } = this.properties;
    const element: React.ReactElement<HeroSliderProps> = React.createElement(
      HeroSlider,
      {
        hideControls,
        hideNavigation,
        slidesLimit,
        dataProvider: this.getDataProvider(),
        context: this.context,
      },
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.VisibilityGroupName,
              groupFields: [
                PropertyPaneCheckbox('hideControls', {
                  text: strings.HideControlsFieldLabel,
                  checked: false,
                }),
                PropertyPaneToggle('hideNavigation', {
                  label: strings.HideNavigationFieldLabel,
                  checked: false,
                  onText: 'shown',
                  offText: 'hidden',
                }),
              ],
            },
            {
              groupName: strings.LimitsGroupName,
              groupFields: [
                PropertyPaneSlider('slidesLimit', {
                  label: strings.SlidesLimitFieldLabel,
                  min: 2,
                  max: 6,
                  value: 4,
                  showValue: true,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
