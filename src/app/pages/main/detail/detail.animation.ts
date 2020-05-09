import { trigger, transition, group, query, animate, style } from '@angular/animations';

export const detailTransition = trigger('detailTransition', [
    transition(
        ':enter',
        group([
            query('div.mask', [ 
                style({opacity: 0}), 
                animate('400ms linear')
            ]),
            query('div.container', [
                //translate3d(x horizontal,y vertical,z face) 
                style({ transform: 'translate3d(100%, 0, 0)'}),
                animate('400ms ease')
            ])
        ])
    ),
    transition(
        ':leave',
        group([
            query('div.mask', animate('400ms linear', style({ opacity:0 }))),
            query(
                'div.container',
                animate('400ms ease', style({ transform: 'translate3d(100%, 0, 0)' }))
            )
        ])
    )
]);