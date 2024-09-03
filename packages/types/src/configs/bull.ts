import "reflect-metadata";
import {Type} from "class-transformer";

export class BullBoardBoardLogo {
  public path?: string;
  public width?: string;
  public height?: number;
}

export class BullBoardFavIcon {
  public default?: string;
  public alternative?: string;
}

export class BullBoardMiscLinks {
  public text?: string;
  public url?: string;
}
export class BullBoardUiConfig {
  public boardTitle?: string;
  @Type(() =>BullBoardBoardLogo)
  public boardLogo?: BullBoardBoardLogo;
  @Type(() =>BullBoardMiscLinks)
  public miscLinks?: BullBoardMiscLinks[];
  @Type(() =>BullBoardFavIcon)
  public favIcon?: BullBoardFavIcon;
}

export class BullBoardConfig {
  public uiBasePath: string
  @Type(() => BullBoardUiConfig)
  public uiConfig: any;
}
